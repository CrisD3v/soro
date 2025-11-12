export interface DashboardStats {
  totalMaterials: number;
  activeEmployees: number;
  efficiency: number;
  activeAlerts: number;
  lowStockCount: number;
  stockLevel: number;
}

export interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
