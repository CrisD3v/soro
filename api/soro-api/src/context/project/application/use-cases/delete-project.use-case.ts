import { ProjectRepositoryPort } from '@context/project/domain/ports/project.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(projectId);
  }
}
