'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  FolderKanban,
  LayoutDashboard,
  Package,
  Settings,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from '../../organisms/Sidebar/Sidebar';
import { TopBar } from '../../organisms/TopBar/TopBar';
import { DashboardLayoutProps } from './DashboardLayout.types';

export const DashboardLayout = ({ children, className = '' }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data - esto vendrá del context/API
  const sidebarGroups = [
    {
      id: 'main',
      label: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
          href: '/dashboard',
        },
        {
          id: 'inventory',
          label: 'Inventario',
          icon: <Package className="w-5 h-5" />,
          href: '/dashboard/inventory',
        },
        {
          id: 'notifications',
          label: 'Notificaciones',
          icon: <Bell className="w-5 h-5" />,
          href: '/dashboard/notifications',
          badge: 5,
        },
      ],
    },
    {
      id: 'management',
      label: 'Gestión',
      items: [
        {
          id: 'employees',
          label: 'Empleados',
          icon: <Users className="w-5 h-5" />,
          href: '/dashboard/employees',
        },
        {
          id: 'projects',
          label: 'Proyectos',
          icon: <FolderKanban className="w-5 h-5" />,
          href: '/dashboard/projects',
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: <BarChart3 className="w-5 h-5" />,
          href: '/dashboard/reports',
        },
      ],
    },
    {
      id: 'system',
      label: 'Sistema',
      items: [
        {
          id: 'settings',
          label: 'Ajustes',
          icon: <Settings className="w-5 h-5" />,
          href: '/dashboard/settings',
        },
      ],
    },
  ];

  const handleLogout = () => {
    // Implementar logout
    console.log('Logout');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/20 dark:from-gray-950 dark:via-purple-950/30 dark:to-cyan-950/20 ${className}`}>
      {/* Sidebar */}
      <Sidebar
        groups={sidebarGroups}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? '80px' : '280px',
        }}
      >
        {/* TopBar */}
        <TopBar
          companyName="GRUPO MATEX"
          userName="Admin User"
          notificationCount={5}
          breadcrumbs={[
            { id: '1', label: 'Dashboard' },
            { id: '2', label: 'Inventario' },
          ]}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
