import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import type { NotificationFilters, NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject('NotificationRepositoryPort')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) { }

  async execute(userId: string, filters?: NotificationFilters): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByUser(userId, filters);
  }
}

