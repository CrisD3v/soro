import { Task } from '@context/task/domain/entities/task.entity';
import { TaskRepositoryPort } from '@context/task/domain/ports/task.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(taskId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return await this.taskRepository.update(taskId, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }
}
