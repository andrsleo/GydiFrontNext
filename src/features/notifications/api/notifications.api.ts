import { apiClient } from '@/lib/api/client';
import type { Notification, NotificationsPage, UnreadCount } from '../types';

export const notificationsApi = {
  /**
   * GET /api/v1/notifications
   * Returns paginated notifications for the authenticated user.
   */
  async getNotifications(page = 0, size = 20): Promise<NotificationsPage> {
    const { data } = await apiClient.get<NotificationsPage>('/api/v1/notifications', {
      params: { page, size },
    });
    return data;
  },

  /**
   * GET /api/v1/notifications/unread-count
   */
  async getUnreadCount(): Promise<UnreadCount> {
    const { data } = await apiClient.get<UnreadCount>('/api/v1/notifications/unread-count');
    return data;
  },

  /**
   * PUT /api/v1/notifications/{id}/read
   */
  async markRead(id: number): Promise<void> {
    await apiClient.put(`/api/v1/notifications/${id}/read`);
  },

  /**
   * PUT /api/v1/notifications/read-all
   */
  async markAllRead(): Promise<void> {
    await apiClient.put('/api/v1/notifications/read-all');
  },
};
