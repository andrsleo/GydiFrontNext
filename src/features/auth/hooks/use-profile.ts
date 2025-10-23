/**
 * User Profile Hooks
 *
 * React Query hooks for managing user profiles (extended user information).
 */

'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { profilesApi, getCurrentUserProfile, upsertUserProfile } from '@/lib/api/users.api';
import type {
  UserProfileResponse,
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
} from '../types';

/**
 * Query keys for profile-related queries
 */
export const profileKeys = {
  all: ['profiles'] as const,
  byId: (id: string) => [...profileKeys.all, 'id', id] as const,
  byUserId: (userId: number) => [...profileKeys.all, 'userId', userId] as const,
  current: () => [...profileKeys.all, 'current'] as const,
};

/**
 * Hook to fetch a profile by profile ID
 *
 * @param id - Profile ID (UUID)
 * @param options - React Query options
 * @returns Query object with profile data
 *
 * @example
 * function ProfileView({ profileId }: { profileId: string }) {
 *   const { data: profile, isLoading } = useProfile(profileId);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!profile) return <div>Profile not found</div>;
 *
 *   return <div>{profile.bio}</div>;
 * }
 */
export function useProfile(
  id: string,
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserProfileResponse, Error>({
    queryKey: profileKeys.byId(id),
    queryFn: () => profilesApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch a profile by user ID
 *
 * @param userId - User ID
 * @param options - React Query options
 * @returns Query object with profile data
 *
 * @example
 * function UserProfileSection({ userId }: { userId: number }) {
 *   const { data: profile, isLoading } = useProfileByUserId(userId);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!profile) return <div>No profile found</div>;
 *
 *   return (
 *     <div>
 *       <img src={profile.avatarUrl || '/default-avatar.png'} />
 *       <p>{profile.bio}</p>
 *     </div>
 *   );
 * }
 */
export function useProfileByUserId(
  userId: number,
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserProfileResponse, Error>({
    queryKey: profileKeys.byUserId(userId),
    queryFn: () => profilesApi.getByUserId(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch current user's profile
 *
 * Automatically uses the logged-in user's ID from the session.
 *
 * @param options - React Query options
 * @returns Query object with profile data
 *
 * @example
 * function MyProfilePage() {
 *   const { data: profile, isLoading } = useCurrentUserProfile();
 *
 *   if (isLoading) return <Skeleton />;
 *
 *   return (
 *     <div>
 *       <h1>My Profile</h1>
 *       <p>{profile?.bio || 'No bio yet'}</p>
 *     </div>
 *   );
 * }
 */
export function useCurrentUserProfile(
  options?: Omit<
    UseQueryOptions<UserProfileResponse | null, Error>,
    'queryKey' | 'queryFn'
  >
) {
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  return useQuery<UserProfileResponse | null, Error>({
    queryKey: profileKeys.current(),
    queryFn: () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return getCurrentUserProfile(userId);
    },
    enabled: !!userId, // Only run query if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to create a new user profile
 *
 * @param options - React Query mutation options
 * @returns Mutation object with create function
 *
 * @example
 * function CreateProfileForm({ userId }: { userId: number }) {
 *   const { mutate: createProfile, isPending } = useCreateProfile({
 *     onSuccess: (profile) => {
 *       toast.success('Profile created successfully');
 *     },
 *   });
 *
 *   const handleSubmit = (data: CreateUserProfileRequest) => {
 *     createProfile(data);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useCreateProfile(
  options?: Omit<
    UseMutationOptions<UserProfileResponse, Error, CreateUserProfileRequest>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<UserProfileResponse, Error, CreateUserProfileRequest>({
    mutationFn: profilesApi.create,
    onSuccess: (data, variables, context) => {
      // Invalidate profile queries for this user
      queryClient.invalidateQueries({ queryKey: profileKeys.byUserId(variables.userId) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook to update a user profile
 *
 * @param options - React Query mutation options
 * @returns Mutation object with update function
 *
 * @example
 * function EditProfileForm({ userId }: { userId: number }) {
 *   const { mutate: updateProfile, isPending } = useUpdateProfile({
 *     onSuccess: () => {
 *       toast.success('Profile updated successfully');
 *     },
 *   });
 *
 *   const handleSubmit = (data: UpdateUserProfileRequest) => {
 *     updateProfile({ userId, data });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useUpdateProfile(
  options?: Omit<
    UseMutationOptions<
      UserProfileResponse,
      Error,
      { userId: number; data: UpdateUserProfileRequest }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileResponse,
    Error,
    { userId: number; data: UpdateUserProfileRequest }
  >({
    mutationFn: ({ userId, data }) => profilesApi.updateByUserId(userId, data),
    onSuccess: (data, variables, context) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.byUserId(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: profileKeys.byId(data.id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook to delete a user profile
 *
 * @param options - React Query mutation options
 * @returns Mutation object with delete function
 *
 * @example
 * function DeleteProfileButton({ userId }: { userId: number }) {
 *   const { mutate: deleteProfile, isPending } = useDeleteProfile({
 *     onSuccess: () => {
 *       toast.success('Profile deleted successfully');
 *     },
 *   });
 *
 *   return (
 *     <button onClick={() => deleteProfile(userId)} disabled={isPending}>
 *       Delete Profile
 *     </button>
 *   );
 * }
 */
export function useDeleteProfile(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: profilesApi.deleteByUserId,
    onSuccess: (data, userId, context) => {
      // Remove profile from cache
      queryClient.removeQueries({ queryKey: profileKeys.byUserId(userId) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, userId, context);
    },
    ...options,
  });
}

/**
 * Hook to create or update a user profile (upsert pattern)
 *
 * If profile exists, updates it. If not, creates a new one.
 *
 * @param options - React Query mutation options
 * @returns Mutation object with upsert function
 *
 * @example
 * function ProfileForm({ userId }: { userId: number }) {
 *   const { mutate: saveProfile, isPending } = useUpsertProfile({
 *     onSuccess: () => {
 *       toast.success('Profile saved successfully');
 *     },
 *   });
 *
 *   const handleSubmit = (data: UpdateUserProfileRequest) => {
 *     saveProfile({ userId, data });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useUpsertProfile(
  options?: Omit<
    UseMutationOptions<
      UserProfileResponse,
      Error,
      { userId: number; data: UpdateUserProfileRequest }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileResponse,
    Error,
    { userId: number; data: UpdateUserProfileRequest }
  >({
    mutationFn: ({ userId, data }) => upsertUserProfile(userId, data),
    onSuccess: (data, variables, context) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.byUserId(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: profileKeys.byId(data.id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}