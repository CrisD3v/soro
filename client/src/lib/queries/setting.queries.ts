/**
 * Setting Queries
 * React Query hooks para gestión de configuraciones
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingApi } from '../api/setting.api';
import type { CreateSettingDto, SettingFilters, UpdateSettingDto } from '../api/setting.types';

// Query Keys Factory
export const settingKeys = {
  all: ['settings'] as const,
  lists: () => [...settingKeys.all, 'list'] as const,
  list: (filters?: SettingFilters) => [...settingKeys.lists(), filters] as const,
  details: () => [...settingKeys.all, 'detail'] as const,
  detail: (id: string) => [...settingKeys.details(), id] as const,
  byKey: (key: string, companyId: string) => [...settingKeys.all, 'key', key, companyId] as const,
};

/**
 * Hook para obtener todas las configuraciones
 */
export const useSettings = (filters?: SettingFilters) => {
  return useQuery({
    queryKey: settingKeys.list(filters),
    queryFn: () => settingApi.getAll(filters),
  });
};

/**
 * Hook para obtener una configuración por ID
 */
export const useSetting = (id: string) => {
  return useQuery({
    queryKey: settingKeys.detail(id),
    queryFn: () => settingApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener una configuración por key
 */
export const useSettingByKey = (key: string, companyId: string) => {
  return useQuery({
    queryKey: settingKeys.byKey(key, companyId),
    queryFn: () => settingApi.getByKey(key, companyId),
    enabled: !!key && !!companyId,
  });
};

/**
 * Hook para crear una configuración
 */
export const useCreateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettingDto) => settingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.lists() });
      toast.success('Configuración creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear configuración');
    },
  });
};

/**
 * Hook para actualizar una configuración
 */
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSettingDto }) =>
      settingApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: settingKeys.detail(variables.id) });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar configuración');
    },
  });
};

/**
 * Hook para eliminar una configuración
 */
export const useDeleteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.lists() });
      toast.success('Configuración eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar configuración');
    },
  });
};
