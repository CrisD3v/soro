import { TaskRepositoryPort } from '@context/task/domain/ports/task.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.delete(taskId);
  }
}
