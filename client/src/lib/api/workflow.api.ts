/**
 * Workflow API
 * Cliente API para gestión de workflows y automatizaciones
 */

import { apiClient } from './client';
import type { CreateWorkflowDto, UpdateWorkflowDto, Workflow, WorkflowFilters } from './workflow.types';

export const workflowApi = {
  /**
   * Obtener todos los workflows con filtros opcionales
   */
  getAll: async (filters?: WorkflowFilters): Promise<Workflow[]> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.triggerType) params.append('triggerType', filters.triggerType);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<Workflow[]>(`/workflows${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Obtener un workflow por ID
   */
  getById: async (id: string): Promise<Workflow> => {
    return apiClient.get<Workflow>(`/workflows/${id}`);
  },

  /**
   * Crear un nuevo workflow
   */
  create: async (data: CreateWorkflowDto): Promise<Workflow> => {
    return apiClient.post<Workflow>('/workflows', data);
  },

  /**
   * Actualizar un workflow existente
   */
  update: async (id: string, data: UpdateWorkflowDto): Promise<Workflow> => {
    return apiClient.put<Workflow>(`/workflows/${id}`, data);
  },

  /**
   * Eliminar un workflow
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/workflows/${id}`);
  },
};
