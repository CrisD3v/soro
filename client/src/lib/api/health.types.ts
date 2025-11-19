/**
 * Health Types
 * Tipos para el módulo de health checks y monitoreo
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number; // en segundos
  version: string;
  services: ServiceHealth[];
  system: SystemHealth;
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number; // en ms
  lastCheck: string;
  message?: string;
  details?: Record<string, any>;
}

export interface SystemHealth {
  cpu: CPUHealth;
  memory: MemoryHealth;
  disk: DiskHealth;
  network: NetworkHealth;
}

export interface CPUHealth {
  usage: number; // porcentaje
  cores: number;
  model: string;
}

export interface MemoryHealth {
  total: number; // en bytes
  used: number; // en bytes
  free: number; // en bytes
  usage: number; // porcentaje
}

export interface DiskHealth {
  total: number; // en bytes
  used: number; // en bytes
  free: number; // en bytes
  usage: number; // porcentaje
}

export interface NetworkHealth {
  latency: number; // en ms
  bandwidth: number; // en Mbps
  packetsLost: number;
}

// Labels en español para estados
export const HEALTH_STATUS_LABELS: Record<HealthStatus['status'], string> = {
  healthy: 'Saludable',
  degraded: 'Degradado',
  unhealthy: 'No Saludable',
};

// Colores para estados
export const HEALTH_STATUS_COLORS: Record<HealthStatus['status'], string> = {
  healthy: 'bg-green-500/10 text-green-400 border-green-500/20',
  degraded: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  unhealthy: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// Labels para servicios
export const SERVICE_STATUS_LABELS: Record<ServiceHealth['status'], string> = {
  up: 'Activo',
  down: 'Inactivo',
  degraded: 'Degradado',
};

// Colores para servicios
export const SERVICE_STATUS_COLORS: Record<ServiceHealth['status'], string> = {
  up: 'bg-green-500/10 text-green-400 border-green-500/20',
  down: 'bg-red-500/10 text-red-400 border-red-500/20',
  degraded: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};
