import { Inject, Injectable } from '@nestjs/common';
import type { NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';

@Injectable()
export class CountUnreadUseCase {
  constructor(
    @Inject('NotificationRepositoryPort')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) { }

  async execute(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }
}

