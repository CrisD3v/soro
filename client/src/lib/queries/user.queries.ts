/**
 * User Queries
 * TanStack Query hooks para gestión de usuarios
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user.api';
import type {
  AssignRoleDto,
  AssignSignatureDto,
  CreateUserDto,
  UpdateUserDto,
  UserFilters
} from '../api/user.types';

/**
 * Query key factory para usuarios
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de usuarios
 */
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userApi.getAll(filters),
  });
};

/**
 * Hook para obtener un usuario por ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un usuario
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userApi.create(data),
    onSuccess: () => {
      // Invalidar todas las listas de usuarios
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un usuario
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar listas y detalle del usuario actualizado
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para asignar rol a un usuario
 */
export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignRoleDto }) =>
      userApi.assignRole(id, data),
    onSuccess: (_, variables) => {
      // Invalidar detalle del usuario
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para asignar firma a un usuario
 */
export const useAssignSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignSignatureDto }) =>
      userApi.assignSignature(id, data),
    onSuccess: (_, variables) => {
      // Invalidar detalle del usuario
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};
