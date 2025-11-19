/**
 * Notification API Client
 */

import { apiClient } from './client';
import type {
  CreateNotificationDto,
  Notification,
  NotificationFilters
} from './notification.types';

export const notificationApi = {
  /**
   * Obtener todas las notificaciones
   * GET /notifications
   */
  getAll: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Notification[]>(`/notifications?${params}`);
  },

  /**
   * Obtener una notificación por ID
   * GET /notifications/:id
   */
  getById: async (id: string): Promise<Notification> => {
    return apiClient.get<Notification>(`/notifications/${id}`);
  },

  /**
   * Crear una nueva notificación
   * POST /notifications
   */
  create: async (data: CreateNotificationDto): Promise<Notification> => {
    return apiClient.post<Notification>('/notifications', data);
  },

  /**
   * Marcar notificación como leída
   * PUT /notifications/:id
   */
  markAsRead: async (id: string): Promise<Notification> => {
    return apiClient.put<Notification>(`/notifications/${id}`, { isRead: true });
  },

  /**
   * Marcar todas como leídas
   * PUT /notifications/mark-all-read
   */
  markAllAsRead: async (): Promise<void> => {
    return apiClient.put<void>('/notifications/mark-all-read', {});
  },

  /**
   * Eliminar una notificación
   * DELETE /notifications/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/notifications/${id}`);
  },
};
