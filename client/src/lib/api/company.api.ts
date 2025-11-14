/**
 * Company API Client
 */

import { apiClient } from './client';
import type { Company, CompanyFilters, CreateCompanyDto, UpdateCompanyDto } from './company.types';

export const companyApi = {
  /**
   * Obtener todas las empresas
   * GET /companies
   */
  getAll: async (filters?: CompanyFilters): Promise<Company[]> => {
    const params = new URLSearchParams();

    if (filters?.parentId !== undefined) {
      params.append('parentId', filters.parentId || '');
    }
    if (filters?.name) params.append('name', filters.name);
    if (filters?.includeDeleted) params.append('includeDeleted', 'true');

    const queryString = params.toString();
    const url = queryString ? `/companies?${queryString}` : '/companies';

    return apiClient.get<Company[]>(url);
  },

  /**
   * Obtener una empresa por ID
   * GET /companies/:id
   */
  getById: async (id: string, includeDeleted?: boolean): Promise<Company> => {
    const params = includeDeleted ? '?includeDeleted=true' : '';
    return apiClient.get<Company>(`/companies/${id}${params}`);
  },

  /**
   * Crear una nueva empresa
   * POST /companies
   */
  create: async (data: CreateCompanyDto): Promise<Company> => {
    return apiClient.post<Company>('/companies', data);
  },

  /**
   * Actualizar una empresa
   * PUT /companies/:id
   */
  update: async (id: string, data: UpdateCompanyDto): Promise<Company> => {
    return apiClient.put<Company>(`/companies/${id}`, data);
  },

  /**
   * Eliminar una empresa (soft delete)
   * DELETE /companies/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/companies/${id}`);
  },

  /**
   * Restaurar una empresa eliminada
   * PATCH /companies/:id/restore
   */
  restore: async (id: string): Promise<void> => {
    return apiClient.patch<void>(`/companies/${id}/restore`);
  },

  /**
   * Obtener jerarquía de una empresa
   * GET /companies/:id/hierarchy
   */
  getHierarchy: async (id: string): Promise<Company> => {
    return apiClient.get<Company>(`/companies/${id}/hierarchy`);
  },
};
