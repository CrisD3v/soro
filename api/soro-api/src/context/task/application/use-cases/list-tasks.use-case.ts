import { Task } from '@context/task/domain/entities/task.entity';
import {
  ListTasksFilters,
  TaskRepositoryPort,
} from '@context/task/domain/ports/task.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(filters?: ListTasksFilters): Promise<Task[]> {
    return await this.taskRepository.list(filters);
  }
}
