import { Task } from '@context/task/domain/entities/task.entity';

export class TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(task: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = task.id;
    dto.title = task.title;
    dto.description = task.description;
    dto.status = task.status;
    dto.priority = task.priority;
    dto.dueDate = task.dueDate;
    dto.projectId = task.projectId;
    dto.assignedTo = task.assignedTo;
    dto.createdAt = task.createdAt!;
    dto.updatedAt = task.updatedAt!;
    return dto;
  }
}
