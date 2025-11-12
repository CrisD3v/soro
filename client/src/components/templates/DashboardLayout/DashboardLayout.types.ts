export interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
}
