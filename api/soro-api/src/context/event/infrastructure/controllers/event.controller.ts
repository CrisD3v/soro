import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateEventDto } from '../../application/dto/create-event.dto';
import { EventResponseDto } from '../../application/dto/event-response.dto';
import { CreateEventUseCase } from '../../application/use-cases/create-event.use-case';
import { ListEventsUseCase } from '../../application/use-cases/list-events.use-case';
import { ProcessEventUseCase } from '../../application/use-cases/process-event.use-case';
import { EventMapper } from '../mappers/event.mapper';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly listEventsUseCase: ListEventsUseCase,
    private readonly processEventUseCase: ProcessEventUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created', type: EventResponseDto })
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.createEventUseCase.execute(dto);
    return EventMapper.toResponse(event);
  }

  @Get()
  @ApiOperation({ summary: 'List events with filters' })
  @ApiResponse({ status: 200, description: 'Events list', type: [EventResponseDto] })
  async list(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('entity') entity?: string,
  ): Promise<EventResponseDto[]> {
    const events = await this.listEventsUseCase.execute({ type, status, entity });
    return events.map(EventMapper.toResponse);
  }

  @Patch(':id/process')
  @ApiOperation({ summary: 'Process an event (mark as completed or failed)' })
  @ApiResponse({ status: 200, description: 'Event processed', type: EventResponseDto })
  async process(
    @Param('id') id: string,
    @Body('status') status: 'completed' | 'failed',
  ): Promise<EventResponseDto> {
    const event = await this.processEventUseCase.execute(id, status);
    return EventMapper.toResponse(event);
  }
}
