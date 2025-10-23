/**
 * User Management Hooks
 *
 * React Query hooks for CRUD operations on users.
 */

'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users.api';
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from '../types';

/**
 * Query keys for user-related queries
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number }) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

/**
 * Hook to fetch a single user by ID
 *
 * @param id - User ID
 * @param options - React Query options
 * @returns Query object with user data
 *
 * @example
 * function UserProfile({ userId }: { userId: number }) {
 *   const { data: user, isLoading } = useUser(userId);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!user) return <div>User not found</div>;
 *
 *   return <div>{user.name}</div>;
 * }
 */
export function useUser(
  id: number,
  options?: Omit<UseQueryOptions<UserResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserResponse, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch all users (paginated)
 *
 * @param params - Pagination parameters
 * @param options - React Query options
 * @returns Query object with users array
 *
 * @example
 * function UsersList() {
 *   const { data: users, isLoading } = useUsers({ page: 0, size: 20 });
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <ul>
 *       {users?.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */
export function useUsers(
  params?: { page?: number; size?: number },
  options?: Omit<UseQueryOptions<UserResponse[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserResponse[], Error>({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to create a new user
 *
 * @param options - React Query mutation options
 * @returns Mutation object with create function
 *
 * @example
 * function CreateUserForm() {
 *   const { mutate: createUser, isPending } = useCreateUser({
 *     onSuccess: (user) => {
 *       toast.success(`User ${user.name} created successfully`);
 *     },
 *   });
 *
 *   const handleSubmit = (data: CreateUserRequest) => {
 *     createUser(data);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useCreateUser(
  options?: Omit<UseMutationOptions<UserResponse, Error, CreateUserRequest>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, CreateUserRequest>({
    mutationFn: usersApi.create,
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate users list to refetch with new user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Call user's onSuccess if provided (React Query handles this automatically)
      options?.onSuccess?.(data, variables, context);
    },
  });
}

/**
 * Hook to update an existing user
 *
 * @param options - React Query mutation options
 * @returns Mutation object with update function
 *
 * @example
 * function EditUserForm({ userId }: { userId: number }) {
 *   const { mutate: updateUser, isPending } = useUpdateUser({
 *     onSuccess: (user) => {
 *       toast.success('User updated successfully');
 *     },
 *   });
 *
 *   const handleSubmit = (data: UpdateUserRequest) => {
 *     updateUser({ id: userId, data });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<UserResponse, Error, { id: number; data: UpdateUserRequest }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, { id: number; data: UpdateUserRequest }>({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate specific user query
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
  });
}

/**
 * Hook to delete a user
 *
 * @param options - React Query mutation options
 * @returns Mutation object with delete function
 *
 * @example
 * function DeleteUserButton({ userId }: { userId: number }) {
 *   const { mutate: deleteUser, isPending } = useDeleteUser({
 *     onSuccess: () => {
 *       toast.success('User deleted successfully');
 *     },
 *   });
 *
 *   return (
 *     <button onClick={() => deleteUser(userId)} disabled={isPending}>
 *       Delete User
 *     </button>
 *   );
 * }
 */
export function useDeleteUser(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: usersApi.delete,
    ...options,
    onSuccess: (data, userId, context) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, userId, context);
    },
  });
}