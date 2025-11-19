/**
 * Deal API Client
 */

import { apiClient } from './client';
import type { CreateDealDto, Deal, DealFilters, UpdateDealDto } from './deal.types';

export const dealApi = {
  /**
   * Obtener todos los deals
   * GET /deals
   */
  getAll: async (filters?: DealFilters): Promise<Deal[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Deal[]>(`/deals?${params}`);
  },

  /**
   * Obtener un deal por ID
   * GET /deals/:id
   */
  getById: async (id: string): Promise<Deal> => {
    return apiClient.get<Deal>(`/deals/${id}`);
  },

  /**
   * Crear un nuevo deal
   * POST /deals
   */
  create: async (data: CreateDealDto): Promise<Deal> => {
    return apiClient.post<Deal>('/deals', data);
  },

  /**
   * Actualizar un deal
   * PUT /deals/:id
   */
  update: async (id: string, data: UpdateDealDto): Promise<Deal> => {
    return apiClient.put<Deal>(`/deals/${id}`, data);
  },

  /**
   * Eliminar un deal (soft delete)
   * DELETE /deals/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/deals/${id}`);
  },
};
