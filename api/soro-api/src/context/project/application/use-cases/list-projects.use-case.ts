import { Project } from '@context/project/domain/entities/project.entity';
import {
  ListProjectsFilters,
  ProjectRepositoryPort,
} from '@context/project/domain/ports/project.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(filters?: ListProjectsFilters): Promise<Project[]> {
    return await this.projectRepository.list(filters);
  }
}
