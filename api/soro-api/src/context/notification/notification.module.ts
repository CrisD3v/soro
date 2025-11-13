import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CountUnreadUseCase } from './application/use-cases/count-unread.use-case';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { ListNotificationsUseCase } from './application/use-cases/list-notifications.use-case';
import { MarkAllAsReadUseCase } from './application/use-cases/mark-all-as-read.use-case';
import { MarkAsReadUseCase } from './application/use-cases/mark-as-read.use-case';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { PrismaNotificationRepository } from './infrastructure/persistence/prisma-notification.repository';

@Module({
  controllers: [NotificationController],
  providers: [
    PrismaService,
    {
      provide: 'NotificationRepositoryPort',
      useClass: PrismaNotificationRepository,
    },
    CreateNotificationUseCase,
    ListNotificationsUseCase,
    MarkAsReadUseCase,
    MarkAllAsReadUseCase,
    CountUnreadUseCase,
  ],
  exports: [CreateNotificationUseCase],
})
export class NotificationModule { }
