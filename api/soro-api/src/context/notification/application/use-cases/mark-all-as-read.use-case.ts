import { Inject, Injectable } from '@nestjs/common';
import type { NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';

@Injectable()
export class MarkAllAsReadUseCase {
  constructor(
    @Inject('NotificationRepositoryPort')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) { }

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}

