import { Inject, Injectable } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import type { EventRepositoryPort } from '../../domain/ports/event.repository.port';

@Injectable()
export class ListEventsUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: EventRepositoryPort,
  ) { }

  async execute(filters?: { type?: string; status?: string; entity?: string }): Promise<EventEntity[]> {
    return this.eventRepository.list(filters);
  }
}
