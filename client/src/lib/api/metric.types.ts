/**
 * Metric Types
 * Tipos para el módulo de métricas y analíticas
 */

export interface SystemMetrics {
  users: UserMetrics;
  companies: CompanyMetrics;
  projects: ProjectMetrics;
  tasks: TaskMetrics;
  deals: DealMetrics;
  invoices: InvoiceMetrics;
  documents: DocumentMetrics;
  performance: PerformanceMetrics;
}

export interface UserMetrics {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  byRole: Record<string, number>;
}

export interface CompanyMetrics {
  total: number;
  active: number;
  withHierarchy: number;
  newThisMonth: number;
}

export interface ProjectMetrics {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  cancelled: number;
  completionRate: number;
}

export interface TaskMetrics {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  cancelled: number;
  completionRate: number;
  avgCompletionTime: number; // en días
}

export interface DealMetrics {
  total: number;
  active: number;
  won: number;
  lost: number;
  totalValue: number;
  wonValue: number;
  winRate: number;
  avgDealSize: number;
}

export interface InvoiceMetrics {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
  totalAmount: number;
  paidAmount: number;
  overdueAmount: number;
  collectionRate: number;
}

export interface DocumentMetrics {
  total: number;
  totalSize: number; // en bytes
  byType: Record<string, number>;
  uploadedThisMonth: number;
}

export interface PerformanceMetrics {
  avgResponseTime: number; // en ms
  totalRequests: number;
  errorRate: number;
  uptime: number; // porcentaje
}

export interface MetricFilters {
  companyId?: string;
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

// Métricas por período
export interface PeriodMetrics {
  period: string; // fecha o label del período
  users: number;
  projects: number;
  tasks: number;
  deals: number;
  invoices: number;
  revenue: number;
}
