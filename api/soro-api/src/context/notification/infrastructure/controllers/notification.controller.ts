/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateNotificationDto } from '../../application/dto/create-notification.dto';
import { NotificationResponseDto } from '../../application/dto/notification-response.dto';
import { CountUnreadUseCase } from '../../application/use-cases/count-unread.use-case';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { ListNotificationsUseCase } from '../../application/use-cases/list-notifications.use-case';
import { MarkAllAsReadUseCase } from '../../application/use-cases/mark-all-as-read.use-case';
import { MarkAsReadUseCase } from '../../application/use-cases/mark-as-read.use-case';
import { NotificationMapper } from '../mappers/notification.mapper';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markAsReadUseCase: MarkAsReadUseCase,
    private readonly markAllAsReadUseCase: MarkAllAsReadUseCase,
    private readonly countUnreadUseCase: CountUnreadUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create notification (admin only)' })
  @ApiResponse({ status: 201, type: NotificationResponseDto })
  async create(
    @Request() req: any,
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.createNotificationUseCase.execute(
      req.user.sub as string,
      dto,
    );
    return NotificationMapper.toResponse(notification);
  }

  @Get()
  @ApiOperation({ summary: 'List user notifications' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, type: String })
  async findAll(
    @Request() req: any,
    @Query('read') read?: string,
    @Query('type') type?: string,
  ): Promise<NotificationResponseDto[]> {
    const filters: any = {};
    if (read !== undefined) {
      filters.read = read === 'true';
    }
    if (type) {
      filters.type = type;
    }

    const notifications = await this.listNotificationsUseCase.execute(
      req.user.sub as string,
      filters,
    );
    return notifications.map((n) => NotificationMapper.toResponse(n));
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Count unread notifications' })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { count: { type: 'number' } } } })
  async countUnread(@Request() req: any): Promise<{ count: number }> {
    const count = await this.countUnreadUseCase.execute(req.user.sub as string);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async markAsRead(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.markAsReadUseCase.execute(id, req.user.sub as string);
    return NotificationMapper.toResponse(notification);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 204 })
  async markAllAsRead(@Request() req: any): Promise<void> {
    await this.markAllAsReadUseCase.execute(req.user.sub as string);
  }
}
