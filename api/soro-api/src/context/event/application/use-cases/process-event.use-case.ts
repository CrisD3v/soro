import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import type { EventRepositoryPort } from '../../domain/ports/event.repository.port';

@Injectable()
export class ProcessEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: EventRepositoryPort,
  ) { }

  async execute(id: string, status: 'completed' | 'failed'): Promise<EventEntity> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.eventRepository.updateStatus(id, status, new Date());
  }
}
