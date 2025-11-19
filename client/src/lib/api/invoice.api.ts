/**
 * Invoice API Client
 */

import { apiClient } from './client';
import type { CreateInvoiceDto, Invoice, InvoiceFilters, UpdateInvoiceDto } from './invoice.types';

export const invoiceApi = {
  /**
   * Obtener todas las facturas
   * GET /invoices
   */
  getAll: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<Invoice[]>(`/invoices?${params}`);
  },

  /**
   * Obtener una factura por ID
   * GET /invoices/:id
   */
  getById: async (id: string): Promise<Invoice> => {
    return apiClient.get<Invoice>(`/invoices/${id}`);
  },

  /**
   * Crear una nueva factura
   * POST /invoices
   */
  create: async (data: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient.post<Invoice>('/invoices', data);
  },

  /**
   * Actualizar una factura
   * PUT /invoices/:id
   */
  update: async (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    return apiClient.put<Invoice>(`/invoices/${id}`, data);
  },

  /**
   * Eliminar una factura (soft delete)
   * DELETE /invoices/:id
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/invoices/${id}`);
  },
};
