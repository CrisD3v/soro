/**
 * Event API
 * Cliente API para gestión de eventos del sistema
 */

import { apiClient } from './client';
import type { CreateEventDto, Event, EventFilters } from './event.types';

export const eventApi = {
  /**
   * Obtener todos los eventos con filtros opcionales
   */
  getAll: async (filters?: EventFilters): Promise<Event[]> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.entityType) params.append('entityType', filters.entityType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    return apiClient.get<Event[]>(`/events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Obtener un evento por ID
   */
  getById: async (id: string): Promise<Event> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  /**
   * Crear un nuevo evento
   */
  create: async (data: CreateEventDto): Promise<Event> => {
    return apiClient.post<Event>('/events', data);
  },

  /**
   * Procesar un evento
   */
  process: async (id: string): Promise<Event> => {
    return apiClient.patch<Event>(`/events/${id}/process`, {});
  },
};
