export interface Movement {
  id: string;
  type: 'entrada' | 'salida' | 'transferencia';
  material: string;
  quantity: number;
  user: string;
  project?: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface MovementHistoryCardProps {
  movements: Movement[];
  delay?: number;
  className?: string;
}
