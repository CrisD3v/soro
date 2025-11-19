/**
 * Setting API
 * Cliente API para gestión de configuraciones del sistema
 */

import { apiClient } from './client';
import type { CreateSettingDto, Setting, SettingFilters, UpdateSettingDto } from './setting.types';

export const settingApi = {
  /**
   * Obtener todas las configuraciones con filtros opcionales
   */
  getAll: async (filters?: SettingFilters): Promise<Setting[]> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isPublic !== undefined) params.append('isPublic', String(filters.isPublic));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<Setting[]>(`/settings${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Obtener una configuración por ID
   */
  getById: async (id: string): Promise<Setting> => {
    return apiClient.get<Setting>(`/settings/${id}`);
  },

  /**
   * Obtener una configuración por key
   */
  getByKey: async (key: string, companyId: string): Promise<Setting> => {
    return apiClient.get<Setting>(`/settings/key/${key}?companyId=${companyId}`);
  },

  /**
   * Crear una nueva configuración
   */
  create: async (data: CreateSettingDto): Promise<Setting> => {
    return apiClient.post<Setting>('/settings', data);
  },

  /**
   * Actualizar una configuración existente
   */
  update: async (id: string, data: UpdateSettingDto): Promise<Setting> => {
    return apiClient.put<Setting>(`/settings/${id}`, data);
  },

  /**
   * Eliminar una configuración
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/settings/${id}`);
  },
};
