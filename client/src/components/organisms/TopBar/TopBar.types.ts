export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface TopBarProps {
  companyName: string;
  userName: string;
  userAvatar?: string;
  notificationCount?: number;
  breadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
  className?: string;
}
