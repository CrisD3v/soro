/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationFilters, NotificationRepositoryPort } from '../../domain/ports/notification.repository.port';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(notification: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const data = await this.prisma.notification.create({
      data: {
        userId: notification.userId!,
        title: notification.title!,
        message: notification.message!,
        type: notification.type!,
        entityType: notification.entityType,
        entityId: notification.entityId,
        read: false,
      },
    });

    return NotificationMapper.toDomain(data);
  }

  async findById(id: string, userId: string): Promise<NotificationEntity | null> {
    const data = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    return data ? NotificationMapper.toDomain(data) : null;
  }

  async findByUser(userId: string, filters?: NotificationFilters): Promise<NotificationEntity[]> {
    const where: Record<string, any> = { userId };

    if (filters?.read !== undefined) {
      where.read = filters.read;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    const data = await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return data.map((notification) => NotificationMapper.toDomain(notification));
  }

  async markAsRead(id: string, userId: string): Promise<NotificationEntity> {
    const data = await this.prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NotificationMapper.toDomain(data);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: { userId },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
