/**
 * Permissions API Client
 *
 * API calls for permission checking and resource limit validation.
 * All endpoints correspond to backend PermissionsController.
 */

import { get, post } from './client';
import type {
  Permission,
  PermissionCheckRequest,
  PermissionCheckResponse,
  ResourceType,
  ResourceLimitCheckRequest,
  ResourceLimitCheckResponse,
} from '@/types/user';

const PERMISSIONS_BASE_URL = '/api/v1/permissions';

/**
 * Permissions API
 *
 * Methods for checking user permissions and resource limits.
 */
export const permissionsApi = {
  /**
   * Check if a user has a specific permission (GET method)
   *
   * @param userId - User ID
   * @param permission - Permission to check
   * @returns Permission check result
   *
   * @example
   * const result = await permissionsApi.checkPermission('123', 'PROPERTY_PUBLISH');
   * if (result.granted) {
   *   // User can publish properties
   * }
   */
  async checkPermission(userId: string, permission: Permission): Promise<PermissionCheckResponse> {
    return get<PermissionCheckResponse>(
      `${PERMISSIONS_BASE_URL}/check?userId=${userId}&permission=${permission}`
    );
  },

  /**
   * Check if a user has a specific permission (POST method)
   *
   * @param request - Permission check request
   * @returns Permission check result
   *
   * @example
   * const result = await permissionsApi.checkPermissionPost({
   *   userId: '123',
   *   permission: 'PROPERTY_PUBLISH'
   * });
   */
  async checkPermissionPost(request: PermissionCheckRequest): Promise<PermissionCheckResponse> {
    return post<PermissionCheckResponse>(`${PERMISSIONS_BASE_URL}/check`, request);
  },

  /**
   * Check if a user can exceed resource limits (GET method)
   *
   * @param userId - User ID
   * @param resourceType - Type of resource (PROPERTY or REFERRAL)
   * @returns Resource limit check result
   *
   * @example
   * const result = await permissionsApi.checkResourceLimit('123', 'PROPERTY');
   */
  async checkResourceLimit(
    userId: string,
    resourceType: ResourceType
  ): Promise<ResourceLimitCheckResponse> {
    return get<ResourceLimitCheckResponse>(
      `${PERMISSIONS_BASE_URL}/check-limit?userId=${userId}&resourceType=${resourceType}`
    );
  },

  /**
   * Check if a user can exceed resource limits (POST method)
   *
   * @param request - Resource limit check request
   * @returns Resource limit check result
   *
   * @example
   * const result = await permissionsApi.checkResourceLimitPost({
   *   userId: '123',
   *   resourceType: 'REFERRAL'
   * });
   */
  async checkResourceLimitPost(
    request: ResourceLimitCheckRequest
  ): Promise<ResourceLimitCheckResponse> {
    return post<ResourceLimitCheckResponse>(`${PERMISSIONS_BASE_URL}/check-limit`, request);
  },
};

/**
 * Helper function - Check multiple permissions at once
 *
 * @param userId - User ID
 * @param permissions - Array of permissions to check
 * @returns Map of permission → granted status
 *
 * @example
 * const results = await checkMultiplePermissions('123', [
 *   'PROPERTY_PUBLISH',
 *   'REFERRAL_GENERATE'
 * ]);
 *
 * if (results['PROPERTY_PUBLISH']) {
 *   // Can publish
 * }
 */
export async function checkMultiplePermissions(
  userId: string,
  permissions: Permission[]
): Promise<Record<Permission, boolean>> {
  const checks = await Promise.all(
    permissions.map((permission) => permissionsApi.checkPermission(userId, permission))
  );

  return permissions.reduce(
    (acc, permission, index) => {
      acc[permission] = checks[index].granted;
      return acc;
    },
    {} as Record<Permission, boolean>
  );
}

/**
 * Helper function - Check if user can perform action based on resource limit
 *
 * @param userId - User ID
 * @param resourceType - Type of resource
 * @returns True if user can create more resources
 *
 * @example
 * const canPublish = await canCreateResource('123', 'PROPERTY');
 * if (!canPublish) {
 *   alert('You have reached your property limit. Upgrade your plan!');
 * }
 */
export async function canCreateResource(
  userId: string,
  resourceType: ResourceType
): Promise<boolean> {
  const result = await permissionsApi.checkResourceLimit(userId, resourceType);
  return result.canExceedLimit;
}

/**
 * Helper function - Get remaining capacity for a resource
 *
 * @param userId - User ID
 * @param resourceType - Type of resource
 * @returns Remaining capacity
 *
 * @example
 * const remaining = await getRemainingCapacity('123', 'REFERRAL');
 */
export async function getRemainingCapacity(
  userId: string,
  resourceType: ResourceType
): Promise<number> {
  const result = await permissionsApi.checkResourceLimit(userId, resourceType);
  return result.remainingCapacity;
}