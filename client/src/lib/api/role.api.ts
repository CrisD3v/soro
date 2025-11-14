/**
 * Role API Client
 */

import { apiClient } from './client';
import type { AssignPermissionDto, CreateRoleDto, Permission, Role, UpdateRoleDto } from './role.types';

export const roleApi = {
  /**
   * Obtener todos los roles
   * GET /roles
   */
  getAll: async (): Promise<Role[]> => {
    return apiClient.get<Role[]>('/roles');
  },

  /**
   * Obtener un rol por ID
   * GET /roles/:id
   */
  getById: async (id: string): Promise<Role> => {
    return apiClient.get<Role>(`/roles/${id}`);
  },

  /**
   * Crear un nuevo rol
   * POST /roles
   */
  create: async (data: CreateRoleDto): Promise<Role> => {
    return apiClient.post<Role>('/roles', data);
  },

  /**
   * Actualizar un rol
   * PUT /roles/:id
   */
  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    return apiClient.put<Role>(`/roles/${id}`, data);
  },

  /**
   * Eliminar un rol
   * DELETE /roles/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/roles/${id}`);
  },

  /**
   * Asignar permiso a un rol
   * POST /roles/:id/permissions
   */
  assignPermission: async (id: string, data: AssignPermissionDto): Promise<void> => {
    return apiClient.post<void>(`/roles/${id}/permissions`, data);
  },

  /**
   * Remover permiso de un rol
   * DELETE /roles/:id/permissions/:permissionId
   */
  removePermission: async (id: string, permissionId: string): Promise<void> => {
    return apiClient.delete<void>(`/roles/${id}/permissions/${permissionId}`);
  },

  /**
   * Listar permisos de un rol
   * GET /roles/:id/permissions
   */
  getPermissions: async (id: string): Promise<Permission[]> => {
    return apiClient.get<Permission[]>(`/roles/${id}/permissions`);
  },
};
