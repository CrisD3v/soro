import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { GetProjectUseCase } from './application/use-cases/get-project.use-case';
import { ListProjectsUseCase } from './application/use-cases/list-projects.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { ProjectRepositoryPort } from './domain/ports/project.repository.port';
import { ProjectController } from './infrastructure/controllers/project.controller';
import { PrismaProjectRepository } from './infrastructure/persistence/prisma-project.repository';

@Module({
  controllers: [ProjectController],
  providers: [
    PrismaService,
    PrismaProjectRepository,
    {
      provide: ProjectRepositoryPort,
      useClass: PrismaProjectRepository,
    },
    CreateProjectUseCase,
    UpdateProjectUseCase,
    GetProjectUseCase,
    ListProjectsUseCase,
    DeleteProjectUseCase,
  ],
  exports: [ProjectRepositoryPort],
})
export class ProjectModule {}
