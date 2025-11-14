import { Inject, Injectable } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import type { EventRepositoryPort } from '../../domain/ports/event.repository.port';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: EventRepositoryPort,
  ) { }

  async execute(dto: CreateEventDto): Promise<EventEntity> {
    return this.eventRepository.create({
      type: dto.type,
      entity: dto.entity,
      entityId: dto.entityId,
      payload: dto.payload,
      status: dto.status || 'pending',
      processedAt: null,
    });
  }
}
