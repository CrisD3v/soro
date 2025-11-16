/**
 * Permission API Client
 */

import { apiClient } from './client';
import type { Permission } from './role.types';

export const permissionApi = {
  /**
   * Obtener todos los permisos
   * GET /permissions
   */
  getAll: async (): Promise<Permission[]> => {
    return apiClient.get<Permission[]>('/permissions');
  },
};
