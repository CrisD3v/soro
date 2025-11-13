import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import type { NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject('NotificationRepositoryPort')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) { }

  async execute(userId: string, dto: CreateNotificationDto): Promise<NotificationEntity> {
    const notification = new NotificationEntity({
      userId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      entityType: dto.entityType,
      entityId: dto.entityId,
      read: false,
    });

    return this.notificationRepository.create(notification);
  }
}

