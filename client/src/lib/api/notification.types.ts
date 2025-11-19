/**
 * Notification API Types
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  userId: string;
  companyId: string;
}

export interface UpdateNotificationDto {
  isRead?: boolean;
}

export interface NotificationFilters {
  userId?: string;
  companyId?: string;
  type?: NotificationType;
  isRead?: boolean;
}
