import { Project } from '@context/project/domain/entities/project.entity';
import { Project as PrismaProject } from '@prisma/client';

export class ProjectMapper {
  static toDomain(prismaProject: PrismaProject): Project {
    return new Project(
      prismaProject.id,
      prismaProject.name,
      prismaProject.description,
      prismaProject.status,
      prismaProject.startDate,
      prismaProject.endDate,
      prismaProject.companyId,
      prismaProject.createdBy,
      prismaProject.createdAt,
      prismaProject.updatedAt,
    );
  }

  static toDomainList(prismaProjects: PrismaProject[]): Project[] {
    return prismaProjects.map((project) => this.toDomain(project));
  }
}
