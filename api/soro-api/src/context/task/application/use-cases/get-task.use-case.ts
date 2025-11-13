import { Task } from '@context/task/domain/entities/task.entity';
import { TaskRepositoryPort } from '@context/task/domain/ports/task.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
