import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { GetTaskUseCase } from './application/use-cases/get-task.use-case';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { TaskRepositoryPort } from './domain/ports/task.repository.port';
import { TaskController } from './infrastructure/controllers/task.controller';
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository';

@Module({
  controllers: [TaskController],
  providers: [
    PrismaService,
    PrismaTaskRepository,
    {
      provide: TaskRepositoryPort,
      useClass: PrismaTaskRepository,
    },
    CreateTaskUseCase,
    UpdateTaskUseCase,
    GetTaskUseCase,
    ListTasksUseCase,
    DeleteTaskUseCase,
  ],
  exports: [TaskRepositoryPort],
})
export class TaskModule {}
