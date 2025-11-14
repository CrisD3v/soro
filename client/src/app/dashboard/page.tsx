'use client';

/**
 * Dashboard Page
 * Página principal del dashboard con KPIs y resumen
 */

import { StatCard } from '@/components/molecules/StatCard/StatCard';
import { InventorySummaryCard } from '@/components/organisms/InventorySummaryCard/InventorySummaryCard';
import { MovementHistoryCard } from '@/components/organisms/MovementHistoryCard/MovementHistoryCard';
import { NotificationsCard } from '@/components/organisms/NotificationsCard/NotificationsCard';
import { RecentAssignmentsCard } from '@/components/organisms/RecentAssignmentsCard/RecentAssignmentsCard';
import { AlertCircle, Package, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - esto vendrá del API
  const mockAssignments = [
    {
      id: '1',
      materialName: 'Tela de Algodón Premium',
      assignedTo: 'Juan Pérez',
      quantity: 150,
      date: '2024-11-10',
      status: 'completed' as const,
    },
    {
      id: '2',
      materialName: 'Hilo Poliéster',
      assignedTo: 'María García',
      quantity: 200,
      date: '2024-11-11',
      status: 'in-progress' as const,
    },
    {
      id: '3',
      materialName: 'Botones Metálicos',
      assignedTo: 'Carlos López',
      quantity: 500,
      date: '2024-11-11',
      status: 'pending' as const,
    },
  ];

  const mockNotifications = [
    {
      id: '1',
      type: 'alert' as const,
      title: 'Stock Bajo',
      message: 'Tela de Algodón Premium tiene solo 50 unidades disponibles',
      time: 'Hace 5 minutos',
      read: false,
    },
    {
      id: '2',
      type: 'alert' as const,
      title: 'Material Vencido',
      message: 'Adhesivo Industrial vence en 3 días',
      time: 'Hace 1 hora',
      read: false,
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Pedido Recibido',
      message: 'Se recibieron 500 unidades de Hilo Poliéster',
      time: 'Hace 2 horas',
      read: true,
    },
    {
      id: '4',
      type: 'success' as const,
      title: 'Auditoría Completada',
      message: 'Auditoría del sector textil finalizada exitosamente',
      time: 'Hace 3 horas',
      read: true,
    },
  ];

  const mockMovements = [
    {
      id: '1',
      type: 'entrada' as const,
      material: 'Tela de Algodón',
      quantity: 500,
      user: 'Juan Pérez',
      date: '2024-11-11',
      status: 'completed' as const,
    },
    {
      id: '2',
      type: 'salida' as const,
      material: 'Hilo Poliéster',
      quantity: 200,
      user: 'María García',
      date: '2024-11-11',
      status: 'completed' as const,
    },
    {
      id: '3',
      type: 'transferencia' as const,
      material: 'Botones Metálicos',
      quantity: 300,
      user: 'Carlos López',
      date: '2024-11-10',
      status: 'pending' as const,
    },
    {
      id: '4',
      type: 'entrada' as const,
      material: 'Cremalleras',
      quantity: 150,
      user: 'Ana Martínez',
      date: '2024-11-10',
      status: 'completed' as const,
    },
    {
      id: '5',
      type: 'salida' as const,
      material: 'Etiquetas',
      quantity: 1000,
      user: 'Pedro Sánchez',
      date: '2024-11-09',
      status: 'completed' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al panel de control de SORO
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Materiales"
          value="1,234"
          icon={<Package className="w-6 h-6" />}
          trend="up"
          trendValue="+12%"
          color="purple"
          delay={0}
        />
        <StatCard
          title="Empleados Activos"
          value="48"
          icon={<Users className="w-6 h-6" />}
          trend="up"
          trendValue="+3"
          color="cyan"
          delay={0.05}
        />
        <StatCard
          title="Eficiencia"
          value="94.5%"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
          trendValue="+2.3%"
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Alertas Activas"
          value="7"
          icon={<AlertCircle className="w-6 h-6" />}
          trend="down"
          trendValue="-3"
          color="red"
          delay={0.15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Inventory Summary */}
        <InventorySummaryCard
          totalMaterials={1234}
          lowStockCount={7}
          stockLevel={68}
          delay={0.2}
        />

        {/* Recent Assignments */}
        <RecentAssignmentsCard
          assignments={mockAssignments}
          delay={0.25}
        />
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Notifications */}
        <NotificationsCard
          notifications={mockNotifications}
          delay={0.3}
        />

        {/* Movement History */}
        <MovementHistoryCard
          movements={mockMovements}
          delay={0.35}
        />
      </div>
    </div>
  );
}
