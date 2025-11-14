export class WorkflowEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly trigger: string,
    public readonly triggerConfig: Record<string, any>,
    public readonly isActive: boolean,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  get isManual(): boolean {
    return this.trigger === 'manual';
  }

  get isScheduled(): boolean {
    return this.trigger === 'scheduled';
  }

  get isEventBased(): boolean {
    return this.trigger === 'event-based';
  }
}
