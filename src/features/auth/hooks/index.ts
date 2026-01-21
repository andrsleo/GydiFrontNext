/**
 * Auth Hooks - Barrel Export
 *
 * Re-exports all auth-related hooks for convenient importing.
 */

// Authentication hooks
export { useLogin, useLogout, useUser, useIsAuthenticated } from './use-auth';

// User management hooks
export {
  useUserById,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  userKeys,
} from './use-users';

// User profile hooks
export {
  useProfile,
  useProfileByUserId,
  useCurrentUserProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
  useUpsertProfile,
  profileKeys,
} from './use-profile';