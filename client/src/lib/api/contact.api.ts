/**
 * Contact API Client
 */

import { apiClient } from './client';
import type { Contact, ContactFilters, CreateContactDto, UpdateContactDto } from './contact.types';

export const contactApi = {
  /**
   * Obtener todos los contactos
   * GET /contacts
   */
  getAll: async (filters?: ContactFilters): Promise<Contact[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Contact[]>(`/contacts?${params}`);
  },

  /**
   * Obtener un contacto por ID
   * GET /contacts/:id
   */
  getById: async (id: string): Promise<Contact> => {
    return apiClient.get<Contact>(`/contacts/${id}`);
  },

  /**
   * Crear un nuevo contacto
   * POST /contacts
   */
  create: async (data: CreateContactDto): Promise<Contact> => {
    return apiClient.post<Contact>('/contacts', data);
  },

  /**
   * Actualizar un contacto
   * PUT /contacts/:id
   */
  update: async (id: string, data: UpdateContactDto): Promise<Contact> => {
    return apiClient.put<Contact>(`/contacts/${id}`, data);
  },

  /**
   * Eliminar un contacto (soft delete)
   * DELETE /contacts/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/contacts/${id}`);
  },
};
