'use client';

/**
 * Health Page
 * Página de monitoreo y health checks del sistema
 */

import type { HealthStatus } from '@/lib/api/health.types';
import {
  HEALTH_STATUS_COLORS,
  HEALTH_STATUS_LABELS,
  SERVICE_STATUS_COLORS,
  SERVICE_STATUS_LABELS,
} from '@/lib/api/health.types';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Server,
  Wifi,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock data hasta que el backend esté implementado
const mockHealth: HealthStatus = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: 2592000, // 30 días en segundos
  version: '2.0.0',
  services: [
    {
      name: 'Database',
      status: 'up',
      responseTime: 12,
      lastCheck: new Date().toISOString(),
      message: 'PostgreSQL funcionando correctamente',
    },
    {
      name: 'API Server',
      status: 'up',
      responseTime: 8,
      lastCheck: new Date().toISOString(),
      message: 'Servidor API respondiendo',
    },
    {
      name: 'Cache',
      status: 'up',
      responseTime: 3,
      lastCheck: new Date().toISOString(),
      message: 'Redis funcionando',
    },
    {
      name: 'Storage',
      status: 'up',
      responseTime: 15,
      lastCheck: new Date().toISOString(),
      message: 'Almacenamiento disponible',
    },
    {
      name: 'Email Service',
      status: 'up',
      responseTime: 45,
      lastCheck: new Date().toISOString(),
      message: 'Servicio de email operativo',
    },
    {
      name: 'Background Jobs',
      status: 'up',
      responseTime: 5,
      lastCheck: new Date().toISOString(),
      message: 'Workers procesando tareas',
    },
  ],
  system: {
    cpu: {
      usage: 35.2,
      cores: 8,
      model: 'Intel Core i7',
    },
    memory: {
      total: 16777216000, // 16GB
      used: 8388608000, // 8GB
      free: 8388608000, // 8GB
      usage: 50.0,
    },
    disk: {
      total: 536870912000, // 500GB
      used: 268435456000, // 250GB
      free: 268435456000, // 250GB
      usage: 50.0,
    },
    network: {
      latency: 12,
      bandwidth: 1000,
      packetsLost: 0,
    },
  },
};

export default function HealthPage() {
  // Usar mock data en lugar de la API
  const health = mockHealth;
  const isLoading = false;

  // Función para formatear bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Función para formatear uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Función para obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'unhealthy':
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            Health Check
          </h1>
          <p className="text-white/60 mt-1">
            Monitoreo del estado del sistema
          </p>
        </div>
        {health && (
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium border ${HEALTH_STATUS_COLORS[health.status]
                }`}
            >
              {HEALTH_STATUS_LABELS[health.status]}
            </span>
          </div>
        )}
      </div>

      {/* Estado General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Uptime</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatUptime(health?.uptime || 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Versión</p>
              <p className="text-2xl font-bold text-white mt-1">
                {health?.version || 'N/A'}
              </p>
            </div>
            <Server className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Última Verificación</p>
              <p className="text-lg font-bold text-white mt-1">
                {health?.timestamp
                  ? new Date(health.timestamp).toLocaleTimeString('es-ES')
                  : 'N/A'}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Servicios */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-purple-400" />
          Estado de Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {health?.services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{service.name}</h3>
                {getStatusIcon(service.status)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Estado</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${SERVICE_STATUS_COLORS[service.status]
                      }`}
                  >
                    {SERVICE_STATUS_LABELS[service.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Tiempo de Respuesta</span>
                  <span className="text-white text-sm font-medium">
                    {service.responseTime} ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Última Verificación</span>
                  <span className="text-white text-sm">
                    {new Date(service.lastCheck).toLocaleTimeString('es-ES')}
                  </span>
                </div>
                {service.message && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-white/60 text-xs">{service.message}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recursos del Sistema */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          Recursos del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">CPU</h3>
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Uso</span>
                  <span className="text-white text-sm font-medium">
                    {health?.system.cpu.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${health?.system.cpu.usage || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Núcleos</span>
                <span className="text-white text-sm">{health?.system.cpu.cores}</span>
              </div>
            </div>
          </motion.div>

          {/* Memoria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Memoria</h3>
              <Database className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Uso</span>
                  <span className="text-white text-sm font-medium">
                    {health?.system.memory.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${health?.system.memory.usage || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Usado</span>
                <span className="text-white text-sm">
                  {formatBytes(health?.system.memory.used || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-white text-sm">
                  {formatBytes(health?.system.memory.total || 0)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Disco */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Disco</h3>
              <HardDrive className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Uso</span>
                  <span className="text-white text-sm font-medium">
                    {health?.system.disk.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${health?.system.disk.usage || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Usado</span>
                <span className="text-white text-sm">
                  {formatBytes(health?.system.disk.used || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-white text-sm">
                  {formatBytes(health?.system.disk.total || 0)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Red */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Red</h3>
              <Wifi className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Latencia</span>
                <span className="text-white text-sm font-medium">
                  {health?.system.network.latency} ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Ancho de Banda</span>
                <span className="text-white text-sm">
                  {health?.system.network.bandwidth} Mbps
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Paquetes Perdidos</span>
                <span className="text-white text-sm">
                  {health?.system.network.packetsLost}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
