import { Task } from '../entities/task.entity';

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  projectId: string;
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  assignedTo?: string;
}

export interface ListTasksFilters {
  projectId?: string;
  assignedTo?: string;
  status?: string;
  priority?: string;
}

export abstract class TaskRepositoryPort {
  abstract create(data: CreateTaskData): Promise<Task>;
  abstract findById(id: string): Promise<Task | null>;
  abstract update(id: string, data: UpdateTaskData): Promise<Task>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListTasksFilters): Promise<Task[]>;
  abstract findByProject(projectId: string): Promise<Task[]>;
}
