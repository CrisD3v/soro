import { Project } from '@context/project/domain/entities/project.entity';
import { ProjectRepositoryPort } from '@context/project/domain/ports/project.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(projectId: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return await this.projectRepository.update(projectId, dto);
  }
}
