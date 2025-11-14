import { Event as PrismaEvent } from '@prisma/client';
import { EventResponseDto } from '../../application/dto/event-response.dto';
import { EventEntity } from '../../domain/entities/event.entity';

export class EventMapper {
  static toDomain(prismaEvent: PrismaEvent): EventEntity {
    return new EventEntity(
      prismaEvent.id,
      prismaEvent.type,
      prismaEvent.entity,
      prismaEvent.entityId,
      prismaEvent.payload as Record<string, any>,
      prismaEvent.status,
      prismaEvent.processedAt,
      prismaEvent.createdAt,
    );
  }

  static toResponse(entity: EventEntity): EventResponseDto {
    return {
      id: entity.id,
      type: entity.type,
      entity: entity.entity,
      entityId: entity.entityId,
      payload: entity.payload,
      status: entity.status,
      processedAt: entity.processedAt,
      createdAt: entity.createdAt,
    };
  }
}
