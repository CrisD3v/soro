/**
 * Metric Queries
 * React Query hooks para métricas y analíticas
 */

import { useQuery } from '@tanstack/react-query';
import { metricApi } from '../api/metric.api';
import type { MetricFilters } from '../api/metric.types';

// Query Keys Factory
export const metricKeys = {
  all: ['metrics'] as const,
  system: (filters?: MetricFilters) => [...metricKeys.all, 'system', filters] as const,
  period: (filters?: MetricFilters) => [...metricKeys.all, 'period', filters] as const,
  users: (companyId?: string) => [...metricKeys.all, 'users', companyId] as const,
  projects: (companyId?: string) => [...metricKeys.all, 'projects', companyId] as const,
  tasks: (companyId?: string) => [...metricKeys.all, 'tasks', companyId] as const,
  deals: (companyId?: string) => [...metricKeys.all, 'deals', companyId] as const,
  invoices: (companyId?: string) => [...metricKeys.all, 'invoices', companyId] as const,
};

/**
 * Hook para obtener todas las métricas del sistema
 */
export const useSystemMetrics = (filters?: MetricFilters) => {
  return useQuery({
    queryKey: metricKeys.system(filters),
    queryFn: () => metricApi.getSystemMetrics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas por período
 */
export const usePeriodMetrics = (filters?: MetricFilters) => {
  return useQuery({
    queryKey: metricKeys.period(filters),
    queryFn: () => metricApi.getPeriodMetrics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas de usuarios
 */
export const useUserMetrics = (companyId?: string) => {
  return useQuery({
    queryKey: metricKeys.users(companyId),
    queryFn: () => metricApi.getUserMetrics(companyId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas de proyectos
 */
export const useProjectMetrics = (companyId?: string) => {
  return useQuery({
    queryKey: metricKeys.projects(companyId),
    queryFn: () => metricApi.getProjectMetrics(companyId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas de tareas
 */
export const useTaskMetrics = (companyId?: string) => {
  return useQuery({
    queryKey: metricKeys.tasks(companyId),
    queryFn: () => metricApi.getTaskMetrics(companyId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas de deals
 */
export const useDealMetrics = (companyId?: string) => {
  return useQuery({
    queryKey: metricKeys.deals(companyId),
    queryFn: () => metricApi.getDealMetrics(companyId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener métricas de facturas
 */
export const useInvoiceMetrics = (companyId?: string) => {
  return useQuery({
    queryKey: metricKeys.invoices(companyId),
    queryFn: () => metricApi.getInvoiceMetrics(companyId),
    staleTime: 5 * 60 * 1000,
  });
};
