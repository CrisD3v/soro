import { Project } from '../entities/project.entity';

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  companyId: string;
  createdBy: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ListProjectsFilters {
  companyId?: string;
  status?: string;
  createdBy?: string;
}

export abstract class ProjectRepositoryPort {
  abstract create(data: CreateProjectData): Promise<Project>;
  abstract findById(id: string): Promise<Project | null>;
  abstract update(id: string, data: UpdateProjectData): Promise<Project>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListProjectsFilters): Promise<Project[]>;
}
