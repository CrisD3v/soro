/**
 * Project API Client
 */

import { apiClient } from './client';
import type { CreateProjectDto, Project, ProjectFilters, UpdateProjectDto } from './project.types';

export const projectApi = {
  /**
   * Obtener todos los proyectos
   * GET /projects
   */
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Project[]>(`/projects?${params}`);
  },

  /**
   * Obtener un proyecto por ID
   * GET /projects/:id
   */
  getById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  /**
   * Crear un nuevo proyecto
   * POST /projects
   */
  create: async (data: CreateProjectDto): Promise<Project> => {
    return apiClient.post<Project>('/projects', data);
  },

  /**
   * Actualizar un proyecto
   * PUT /projects/:id
   */
  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  /**
   * Eliminar un proyecto (soft delete)
   * DELETE /projects/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/projects/${id}`);
  },
};
