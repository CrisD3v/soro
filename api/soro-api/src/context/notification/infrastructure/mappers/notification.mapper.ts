/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NotificationResponseDto } from '../../application/dto/notification-response.dto';
import { NotificationEntity } from '../../domain/entities/notification.entity';

export class NotificationMapper {
  static toDomain(raw: any): NotificationEntity {
    return new NotificationEntity({
      id: raw.id as string,
      userId: raw.userId as string,
      title: raw.title as string,
      message: raw.message as string,
      type: raw.type as string,
      entityType: raw.entityType as string | undefined,
      entityId: raw.entityId as string | undefined,
      read: raw.read as boolean,
      readAt: raw.readAt as Date | undefined,
      createdAt: raw.createdAt as Date,
    });
  }

  static toResponse(entity: NotificationEntity): NotificationResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      entityType: entity.entityType,
      entityId: entity.entityId,
      read: entity.read,
      readAt: entity.readAt,
      createdAt: entity.createdAt,
    };
  }
}
