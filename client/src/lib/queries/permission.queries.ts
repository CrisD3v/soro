/**
 * Permission Queries
 * TanStack Query hooks para gestión de permisos
 */

import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api/permission.api';

/**
 * Query key factory para permisos
 */
export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: () => [...permissionKeys.lists()] as const,
};

/**
 * Hook para obtener todos los permisos
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () => permissionApi.getAll(),
  });
};
