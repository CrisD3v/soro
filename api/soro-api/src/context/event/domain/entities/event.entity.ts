export class EventEntity {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly entity: string,
    public readonly entityId: string,
    public readonly payload: Record<string, any>,
    public readonly status: string,
    public readonly processedAt: Date | null,
    public readonly createdAt: Date,
  ) { }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isProcessing(): boolean {
    return this.status === 'processing';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }
}
