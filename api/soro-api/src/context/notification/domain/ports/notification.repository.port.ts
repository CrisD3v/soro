import { NotificationEntity } from '../entities/notification.entity';

export interface NotificationRepositoryPort {
  create(notification: Partial<NotificationEntity>): Promise<NotificationEntity>;
  findById(id: string, userId: string): Promise<NotificationEntity | null>;
  findByUser(userId: string, filters?: NotificationFilters): Promise<NotificationEntity[]>;
  markAsRead(id: string, userId: string): Promise<NotificationEntity>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
  countUnread(userId: string): Promise<number>;
}

export interface NotificationFilters {
  read?: boolean;
  type?: string;
  entityType?: string;
}
