export class Project {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public status: string,
    public startDate: Date | null,
    public endDate: Date | null,
    public companyId: string,
    public createdBy: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isActive(): boolean {
    return this.status === 'active';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isOverdue(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate && !this.isCompleted();
  }
}
