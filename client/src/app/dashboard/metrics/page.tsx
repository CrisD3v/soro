'use client';

/**
 * Metrics Page
 * Dashboard de métricas y analíticas del sistema
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MetricFilters, SystemMetrics } from '@/lib/api/metric.types';
import {
  Activity,
  BarChart3,
  CheckSquare,
  FileText,
  FolderKanban,
  Handshake,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

// Mock data hasta que el backend esté implementado
const mockMetrics: SystemMetrics = {
  users: {
    total: 127,
    active: 98,
    inactive: 29,
    newThisMonth: 12,
    byRole: { admin: 5, manager: 15, employee: 107 },
  },
  companies: {
    total: 45,
    active: 42,
    withHierarchy: 18,
    newThisMonth: 3,
  },
  projects: {
    total: 234,
    active: 156,
    completed: 67,
    onHold: 8,
    cancelled: 3,
    completionRate: 28.6,
  },
  tasks: {
    total: 1847,
    todo: 423,
    inProgress: 289,
    inReview: 156,
    done: 934,
    cancelled: 45,
    completionRate: 50.6,
    avgCompletionTime: 3.2,
  },
  deals: {
    total: 89,
    active: 45,
    won: 32,
    lost: 12,
    totalValue: 2450000,
    wonValue: 1680000,
    winRate: 72.7,
    avgDealSize: 27528,
  },
  invoices: {
    total: 156,
    draft: 12,
    sent: 34,
    paid: 98,
    overdue: 8,
    cancelled: 4,
    totalAmount: 3250000,
    paidAmount: 2890000,
    overdueAmount: 145000,
    collectionRate: 88.9,
  },
  documents: {
    total: 2341,
    totalSize: 15728640000, // ~15GB
    byType: { pdf: 1234, docx: 567, xlsx: 340, jpg: 200 },
    uploadedThisMonth: 234,
  },
  performance: {
    avgResponseTime: 145,
    totalRequests: 45678,
    errorRate: 0.8,
    uptime: 99.9,
  },
};

export default function MetricsPage() {
  const [period, setPeriod] = useState<MetricFilters['period']>('month');

  // Usar mock data en lugar de la API
  const metrics = mockMetrics;
  const isLoading = false;

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Función para formatear porcentaje
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Métricas y Analíticas
          </h1>
          <p className="text-white/60 mt-1">
            Dashboard de métricas del sistema
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as MetricFilters['period'])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hoy</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mes</SelectItem>
            <SelectItem value="year">Este Año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Métricas de Usuarios */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.users.total || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
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
                <p className="text-white/60 text-sm">Activos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.users.active || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
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
                <p className="text-white/60 text-sm">Inactivos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.users.inactive || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Nuevos Este Mes</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.users.newThisMonth || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Métricas de Proyectos y Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proyectos */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-400" />
            Proyectos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.projects.total || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Activos</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {metrics?.projects.active || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Completados</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {metrics?.projects.completed || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Tasa de Completación</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatPercentage(metrics?.projects.completionRate || 0)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tareas */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            Tareas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.tasks.total || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">En Progreso</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  {metrics?.tasks.inProgress || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Completadas</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {metrics?.tasks.done || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div>
                <p className="text-white/60 text-sm">Tasa de Completación</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatPercentage(metrics?.tasks.completionRate || 0)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Métricas de Deals */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Handshake className="w-5 h-5 text-purple-400" />
          Deals (CRM)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.deals.total || 0}
                </p>
              </div>
              <Handshake className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Ganados</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {metrics?.deals.won || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Valor Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(metrics?.deals.totalValue || 0)}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatPercentage(metrics?.deals.winRate || 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Métricas de Facturas */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-purple-400" />
          Facturación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Facturas</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.invoices.total || 0}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.7 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Monto Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(metrics?.invoices.totalAmount || 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pagadas</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {formatCurrency(metrics?.invoices.paidAmount || 0)}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.9 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tasa de Cobro</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatPercentage(metrics?.invoices.collectionRate || 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Métricas de Documentos */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Documentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.documents.total || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tamaño Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {((metrics?.documents.totalSize || 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Subidos Este Mes</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.documents.uploadedThisMonth || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Métricas de Performance */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Performance del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tiempo de Respuesta</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.performance.avgResponseTime || 0} ms
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.performance.totalRequests || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tasa de Error</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatPercentage(metrics?.performance.errorRate || 0)}
                </p>
              </div>
              {(metrics?.performance.errorRate || 0) > 5 ? (
                <TrendingDown className="w-8 h-8 text-red-400" />
              ) : (
                <CheckSquare className="w-8 h-8 text-green-400" />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {formatPercentage(metrics?.performance.uptime || 0)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
