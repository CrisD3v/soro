import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import type { NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';

@Injectable()
export class MarkAsReadUseCase {
  constructor(
    @Inject('NotificationRepositoryPort')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) { }

  async execute(notificationId: string, userId: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findById(notificationId, userId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.notificationRepository.markAsRead(notificationId, userId);
  }
}

