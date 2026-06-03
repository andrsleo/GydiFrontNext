export type NotificationType =
  | 'NEW_LIKE'
  | 'NEW_FOLLOWER'
  | 'BOOKING_FROM_CONTENT'
  | 'CONTENT_MILESTONE';

export interface Notification {
  id: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  body?: string;
  entityId?: number;
  entityType?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface UnreadCount {
  count: number;
}

export interface NotificationsPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  NEW_LIKE: '❤️',
  NEW_FOLLOWER: '👤',
  BOOKING_FROM_CONTENT: '🏠',
  CONTENT_MILESTONE: '🎉',
};
