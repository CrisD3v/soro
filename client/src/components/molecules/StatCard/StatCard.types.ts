export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'purple' | 'cyan' | 'red' | 'green' | 'orange';
  delay?: number;
  className?: string;
}
