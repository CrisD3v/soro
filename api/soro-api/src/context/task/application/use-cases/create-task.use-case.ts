import { Task } from '@context/task/domain/entities/task.entity';
import { TaskRepositoryPort } from '@context/task/domain/ports/task.repository.port';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(projectId: string, dto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create({
      ...dto,
      projectId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }
}
