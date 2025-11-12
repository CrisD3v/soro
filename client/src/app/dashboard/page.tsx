'use client';

import { StatCard } from '@/components/molecules/StatCard/StatCard';
import { InventorySummaryCard } from '@/components/organisms/InventorySummaryCard/InventorySummaryCard';
import { RecentAssignmentsCard } from '@/components/organisms/RecentAssignmentsCard/RecentAssignmentsCard';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
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

  return (
    <DashboardLayout>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            delay={0.1}
          />
          <StatCard
            title="Eficiencia"
            value="94.5%"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            trendValue="+2.3%"
            color="green"
            delay={0.2}
          />
          <StatCard
            title="Alertas Activas"
            value="7"
            icon={<AlertCircle className="w-6 h-6" />}
            trend="down"
            trendValue="-3"
            color="red"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Summary */}
          <InventorySummaryCard
            totalMaterials={1234}
            lowStockCount={7}
            stockLevel={68}
            delay={0.4}
          />

          {/* Recent Assignments */}
          <RecentAssignmentsCard
            assignments={mockAssignments}
            delay={0.5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
