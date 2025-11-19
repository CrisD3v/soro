/**
 * Document API Client
 */

import { apiClient } from './client';
import type { CreateDocumentDto, Document, DocumentFilters, UpdateDocumentDto } from './document.types';

export const documentApi = {
  /**
   * Obtener todos los documentos
   * GET /documents
   */
  getAll: async (filters?: DocumentFilters): Promise<Document[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Document[]>(`/documents?${params}`);
  },

  /**
   * Obtener un documento por ID
   * GET /documents/:id
   */
  getById: async (id: string): Promise<Document> => {
    return apiClient.get<Document>(`/documents/${id}`);
  },

  /**
   * Crear un nuevo documento
   * POST /documents
   */
  create: async (data: CreateDocumentDto): Promise<Document> => {
    return apiClient.post<Document>('/documents', data);
  },

  /**
   * Actualizar un documento
   * PUT /documents/:id
   */
  update: async (id: string, data: UpdateDocumentDto): Promise<Document> => {
    return apiClient.put<Document>(`/documents/${id}`, data);
  },

  /**
   * Eliminar un documento (soft delete)
   * DELETE /documents/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/documents/${id}`);
  },
};
