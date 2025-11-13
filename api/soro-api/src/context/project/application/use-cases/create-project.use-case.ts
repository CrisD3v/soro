import { Project } from '@context/project/domain/entities/project.entity';
import { ProjectRepositoryPort } from '@context/project/domain/ports/project.repository.port';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(dto: CreateProjectDto, userId: string): Promise<Project> {
    return await this.projectRepository.create({
      ...dto,
      createdBy: userId,
    });
  }
}
