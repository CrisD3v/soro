import { EventEntity } from '../entities/event.entity';

export interface EventRepositoryPort {
  create(event: {
    type: string;
    entity: string;
    entityId: string;
    payload: Record<string, any>;
    status: string;
    processedAt: Date | null;
  }): Promise<EventEntity>;
  findById(id: string): Promise<EventEntity | null>;
  findByType(type: string): Promise<EventEntity[]>;
  findByStatus(status: string): Promise<EventEntity[]>;
  updateStatus(id: string, status: string, processedAt?: Date): Promise<EventEntity>;
  list(filters?: { type?: string; status?: string; entity?: string }): Promise<EventEntity[]>;
}
