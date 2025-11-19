/**
 * Notification Queries
 * TanStack Query hooks para gestión de notificaciones
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import type { CreateNotificationDto, NotificationFilters } from '../api/notification.types';

/**
 * Query key factory para notificaciones
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de notificaciones
 */
export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationApi.getAll(filters),
  });
};

/**
 * Hook para obtener una notificación por ID
 */
export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear una notificación
 */
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationDto) => notificationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

/**
 * Hook para marcar notificación como leída
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.detail(id) });
    },
  });
};

/**
 * Hook para marcar todas como leídas
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

/**
 * Hook para eliminar una notificación
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};
