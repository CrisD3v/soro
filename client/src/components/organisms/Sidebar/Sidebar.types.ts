import { SidebarGroup } from '../../templates/DashboardLayout/DashboardLayout.types';

export interface SidebarProps {
  groups: SidebarGroup[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}
