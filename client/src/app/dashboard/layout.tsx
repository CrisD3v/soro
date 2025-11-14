'use client';

/**
 * Dashboard Layout
 * Layout principal del dashboard con sidebar y topbar
 */

import { DashboardLayout as DashboardLayoutTemplate } from '@/components/templates/DashboardLayout/DashboardLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutTemplate>{children}</DashboardLayoutTemplate>;
}
