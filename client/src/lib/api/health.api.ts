/**
 * Health API
 * Cliente API para health checks y monitoreo del sistema
 */

import { apiClient } from './client';
import type { HealthStatus } from './health.types';

export const healthApi = {
  /**
   * Obtener el estado de salud del sistema
   */
  getHealth: async (): Promise<HealthStatus> => {
    return apiClient.get<HealthStatus>('/health');
  },

  /**
   * Verificar si el sistema está disponible (ping)
   */
  ping: async (): Promise<{ status: string; timestamp: string }> => {
    return apiClient.get('/health/ping');
  },

  /**
   * Obtener métricas detalladas del sistema
   */
  getMetrics: async (): Promise<any> => {
    return apiClient.get('/health/metrics');
  },
};
