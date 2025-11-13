export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public status: string,
    public priority: string,
    public dueDate: Date | null,
    public projectId: string,
    public assignedTo: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isTodo(): boolean {
    return this.status === 'todo';
  }

  isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isOverdue(): boolean {
    if (!this.dueDate || this.isCompleted()) return false;
    return new Date() > this.dueDate;
  }

  isHighPriority(): boolean {
    return this.priority === 'high';
  }
}
