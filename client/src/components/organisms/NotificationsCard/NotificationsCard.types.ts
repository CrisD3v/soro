export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'default';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface NotificationsCardProps {
  notifications: Notification[];
  delay?: number;
  className?: string;
}
