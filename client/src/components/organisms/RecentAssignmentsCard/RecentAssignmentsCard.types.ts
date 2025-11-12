export interface Assignment {
  id: string;
  materialName: string;
  assignedTo: string;
  quantity: number;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface RecentAssignmentsCardProps {
  assignments: Assignment[];
  delay?: number;
  className?: string;
}
