import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';
import { ListEventsUseCase } from './application/use-cases/list-events.use-case';
import { ProcessEventUseCase } from './application/use-cases/process-event.use-case';
import { EventController } from './infrastructure/controllers/event.controller';
import { PrismaEventRepository } from './infrastructure/persistence/prisma-event.repository';

@Module({
  controllers: [EventController],
  providers: [
    PrismaService,
    {
      provide: 'EventRepositoryPort',
      useClass: PrismaEventRepository,
    },
    CreateEventUseCase,
    ListEventsUseCase,
    ProcessEventUseCase,
  ],
  exports: ['EventRepositoryPort', CreateEventUseCase],
})
export class EventModule { }
