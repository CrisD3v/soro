'use client';

import {
  BarChart3,
  Bell,
  Building,
  CheckSquare,
  FileText,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Shield,
  UserCircle,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from '../../organisms/Sidebar/Sidebar';
import { TopBar } from '../../organisms/TopBar/TopBar';
import { DashboardLayoutProps } from './DashboardLayout.types';

export const DashboardLayout = ({ children, className = '' }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Configuración del sidebar
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
          id: 'users',
          label: 'Usuarios',
          icon: <Users className="w-5 h-5" />,
          href: '/dashboard/users',
        },
        {
          id: 'companies',
          label: 'Empresas',
          icon: <Building className="w-5 h-5" />,
          href: '/dashboard/companies',
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: <Shield className="w-5 h-5" />,
          href: '/dashboard/roles',
        },
        {
          id: 'projects',
          label: 'Proyectos',
          icon: <FolderKanban className="w-5 h-5" />,
          href: '/dashboard/projects',
        },
        {
          id: 'tasks',
          label: 'Tareas',
          icon: <CheckSquare className="w-5 h-5" />,
          href: '/dashboard/tasks',
        },
        {
          id: 'contacts',
          label: 'Contactos',
          icon: <UserCircle className="w-5 h-5" />,
          href: '/dashboard/contacts',
        },
        {
          id: 'deals',
          label: 'Deals',
          icon: <Handshake className="w-5 h-5" />,
          href: '/dashboard/deals',
        },
        {
          id: 'documents',
          label: 'Documentos',
          icon: <FileText className="w-5 h-5" />,
          href: '/dashboard/documents',
        },
        {
          id: 'invoices',
          label: 'Facturas',
          icon: <Receipt className="w-5 h-5" />,
          href: '/dashboard/invoices',
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 relative ${className}`}>
      {/* Gradient Background - Bottom Right Corner */}
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
      {/* Sidebar */}
      <Sidebar
        groups={sidebarGroups}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div
        className="transition-all duration-200 ease-in-out"
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
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
