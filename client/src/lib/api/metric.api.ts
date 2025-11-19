/**
 * Metric API
 * Cliente API para métricas y analíticas del sistema
 */

import { apiClient } from './client';
import type { MetricFilters, PeriodMetrics, SystemMetrics } from './metric.types';

export const metricApi = {
  /**
   * Obtener todas las métricas del sistema
   */
  getSystemMetrics: async (filters?: MetricFilters): Promise<SystemMetrics> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.period) params.append('period', filters.period);

    const queryString = params.toString();
    return apiClient.get<SystemMetrics>(`/metrics${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Obtener métricas por período
   */
  getPeriodMetrics: async (filters?: MetricFilters): Promise<PeriodMetrics[]> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.period) params.append('period', filters.period);

    const queryString = params.toString();
    return apiClient.get<PeriodMetrics[]>(`/metrics/period${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Obtener métricas de usuarios
   */
  getUserMetrics: async (companyId?: string): Promise<SystemMetrics['users']> => {
    const queryString = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get(`/metrics/users${queryString}`);
  },

  /**
   * Obtener métricas de proyectos
   */
  getProjectMetrics: async (companyId?: string): Promise<SystemMetrics['projects']> => {
    const queryString = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get(`/metrics/projects${queryString}`);
  },

  /**
   * Obtener métricas de tareas
   */
  getTaskMetrics: async (companyId?: string): Promise<SystemMetrics['tasks']> => {
    const queryString = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get(`/metrics/tasks${queryString}`);
  },

  /**
   * Obtener métricas de deals
   */
  getDealMetrics: async (companyId?: string): Promise<SystemMetrics['deals']> => {
    const queryString = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get(`/metrics/deals${queryString}`);
  },

  /**
   * Obtener métricas de facturas
   */
  getInvoiceMetrics: async (companyId?: string): Promise<SystemMetrics['invoices']> => {
    const queryString = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get(`/metrics/invoices${queryString}`);
  },
};
