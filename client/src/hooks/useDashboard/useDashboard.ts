import { useEffect, useState } from 'react';
import { DashboardStats, UseDashboardReturn } from './useDashboard.types';

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implementar llamada real al API
      // const response = await dashboardApi.getStats();

      // Mock data por ahora
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: DashboardStats = {
        totalMaterials: 1234,
        activeEmployees: 48,
        efficiency: 94.5,
        activeAlerts: 7,
        lowStockCount: 7,
        stockLevel: 68,
      };

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching dashboard stats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchDashboardStats,
  };
};
