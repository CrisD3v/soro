import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateWorkflowUseCase } from './application/use-cases/create-workflow.use-case';
import { DeleteWorkflowUseCase } from './application/use-cases/delete-workflow.use-case';
import { ListWorkflowsUseCase } from './application/use-cases/list-workflows.use-case';
import { UpdateWorkflowUseCase } from './application/use-cases/update-workflow.use-case';
import { WorkflowController } from './infrastructure/controllers/workflow.controller';
import { PrismaWorkflowRepository } from './infrastructure/persistence/prisma-workflow.repository';

@Module({
  controllers: [WorkflowController],
  providers: [
    PrismaService,
    {
      provide: 'WorkflowRepositoryPort',
      useClass: PrismaWorkflowRepository,
    },
    CreateWorkflowUseCase,
    ListWorkflowsUseCase,
    UpdateWorkflowUseCase,
    DeleteWorkflowUseCase,
  ],
  exports: ['WorkflowRepositoryPort'],
})
export class WorkflowModule { }
