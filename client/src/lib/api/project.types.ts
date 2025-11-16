/**
 * Project API Types
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string | null;
  companyId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status?: ProjectStatus;
  startDate: string;
  endDate?: string | null;
  companyId: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string | null;
}

export interface ProjectFilters {
  companyId?: string;
  status?: ProjectStatus;
  includeDeleted?: boolean;
}
