import { Project } from '@context/project/domain/entities/project.entity';
import {
  CreateProjectData,
  ListProjectsFilters,
  ProjectRepositoryPort,
  UpdateProjectData,
} from '@context/project/domain/ports/project.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProjectData): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'pending',
        startDate: data.startDate,
        endDate: data.endDate,
        companyId: data.companyId,
        createdBy: data.createdBy,
      },
    });

    return ProjectMapper.toDomain(project);
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    return project ? ProjectMapper.toDomain(project) : null;
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data,
    });

    return ProjectMapper.toDomain(project);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }

  async list(filters?: ListProjectsFilters): Promise<Project[]> {
    const where: any = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return ProjectMapper.toDomainList(projects);
  }
}
