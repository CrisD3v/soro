/**
 * Health Queries
 * React Query hooks para health checks y monitoreo
 */

import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api/health.api';

// Query Keys Factory
export const healthKeys = {
  all: ['health'] as const,
  status: () => [...healthKeys.all, 'status'] as const,
  ping: () => [...healthKeys.all, 'ping'] as const,
  metrics: () => [...healthKeys.all, 'metrics'] as const,
};

/**
 * Hook para obtener el estado de salud del sistema
 */
export const useHealth = () => {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: () => healthApi.getHealth(),
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000, // 10 segundos
  });
};

/**
 * Hook para verificar disponibilidad (ping)
 */
export const usePing = () => {
  return useQuery({
    queryKey: healthKeys.ping(),
    queryFn: () => healthApi.ping(),
    refetchInterval: 10000, // Refetch cada 10 segundos
    staleTime: 5000, // 5 segundos
  });
};

/**
 * Hook para obtener métricas del sistema
 */
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: healthKeys.metrics(),
    queryFn: () => healthApi.getMetrics(),
    refetchInterval: 60000, // Refetch cada 60 segundos
    staleTime: 30000, // 30 segundos
  });
};
