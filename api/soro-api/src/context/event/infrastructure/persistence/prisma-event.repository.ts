import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventRepositoryPort } from '../../domain/ports/event.repository.port';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class PrismaEventRepository implements EventRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(event: Omit<EventEntity, 'id' | 'createdAt'>): Promise<EventEntity> {
    const created = await this.prisma.event.create({
      data: {
        type: event.type,
        entity: event.entity,
        entityId: event.entityId,
        payload: event.payload,
        status: event.status,
        processedAt: event.processedAt,
      },
    });
    return EventMapper.toDomain(created);
  }

  async findById(id: string): Promise<EventEntity | null> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    return event ? EventMapper.toDomain(event) : null;
  }

  async findByType(type: string): Promise<EventEntity[]> {
    const events = await this.prisma.event.findMany({ where: { type } });
    return events.map(EventMapper.toDomain);
  }

  async findByStatus(status: string): Promise<EventEntity[]> {
    const events = await this.prisma.event.findMany({ where: { status } });
    return events.map(EventMapper.toDomain);
  }

  async updateStatus(id: string, status: string, processedAt?: Date): Promise<EventEntity> {
    const updated = await this.prisma.event.update({
      where: { id },
      data: { status, processedAt },
    });
    return EventMapper.toDomain(updated);
  }

  async list(filters?: { type?: string; status?: string; entity?: string }): Promise<EventEntity[]> {
    const events = await this.prisma.event.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.entity && { entity: filters.entity }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return events.map(EventMapper.toDomain);
  }
}
