/**
 * Role Queries
 * TanStack Query hooks para gestión de roles
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '../api/role.api';
import type { AssignPermissionDto, CreateRoleDto, UpdateRoleDto } from '../api/role.types';

/**
 * Query key factory para roles
 */
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: (id: string) => [...roleKeys.all, 'permissions', id] as const,
};

/**
 * Hook para obtener lista de roles
 */
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => roleApi.getAll(),
  });
};

/**
 * Hook para obtener un rol por ID
 */
export const useRole = (id: string) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un rol
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un rol
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      roleApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un rol
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

/**
 * Hook para asignar permiso a un rol
 */
export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignPermissionDto }) =>
      roleApi.assignPermission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(variables.id) });
    },
  });
};

/**
 * Hook para remover permiso de un rol
 */
export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionId }: { id: string; permissionId: string }) =>
      roleApi.removePermission(id, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(variables.id) });
    },
  });
};

/**
 * Hook para obtener permisos de un rol
 */
export const useRolePermissions = (id: string) => {
  return useQuery({
    queryKey: roleKeys.permissions(id),
    queryFn: () => roleApi.getPermissions(id),
    enabled: !!id,
  });
};

// Aliases para compatibilidad
export const useAssignPermission = useAssignPermissionToRole;
export const useRemovePermission = useRemovePermissionFromRole;
