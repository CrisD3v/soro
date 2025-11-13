import { Project } from '@context/project/domain/entities/project.entity';
import { ProjectRepositoryPort } from '@context/project/domain/ports/project.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
