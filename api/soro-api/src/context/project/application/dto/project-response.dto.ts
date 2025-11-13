import { Project } from '@context/project/domain/entities/project.entity';

export class ProjectResponseDto {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  companyId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(project: Project): ProjectResponseDto {
    const dto = new ProjectResponseDto();
    dto.id = project.id;
    dto.name = project.name;
    dto.description = project.description;
    dto.status = project.status;
    dto.startDate = project.startDate;
    dto.endDate = project.endDate;
    dto.companyId = project.companyId;
    dto.createdBy = project.createdBy;
    dto.createdAt = project.createdAt!;
    dto.updatedAt = project.updatedAt!;
    return dto;
  }
}
