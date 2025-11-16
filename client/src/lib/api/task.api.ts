/**
 * Task API Client
 */

import { apiClient } from './client';
import type { CreateTaskDto, Task, TaskFilters, UpdateTaskDto } from './task.types';

export const taskApi = {
  /**
   * Obtener todas las tareas
   * GET /tasks
   */
  getAll: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Task[]>(`/tasks?${params}`);
  },

  /**
   * Obtener una tarea por ID
   * GET /tasks/:id
   */
  getById: async (id: string): Promise<Task> => {
    return apiClient.get<Task>(`/tasks/${id}`);
  },

  /**
   * Crear una nueva tarea
   * POST /tasks
   */
  create: async (data: CreateTaskDto): Promise<Task> => {
    return apiClient.post<Task>('/tasks', data);
  },

  /**
   * Actualizar una tarea
   * PUT /tasks/:id
   */
  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    return apiClient.put<Task>(`/tasks/${id}`, data);
  },

  /**
   * Eliminar una tarea (soft delete)
   * DELETE /tasks/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/tasks/${id}`);
  },
};
