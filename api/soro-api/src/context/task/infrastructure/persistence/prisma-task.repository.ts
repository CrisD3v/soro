import { Task } from '@context/task/domain/entities/task.entity';
import {
  CreateTaskData,
  ListTasksFilters,
  TaskRepositoryPort,
  UpdateTaskData,
} from '@context/task/domain/ports/task.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TaskMapper } from '../mappers/task.mapper';

@Injectable()
export class PrismaTaskRepository implements TaskRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskData): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'todo',
        priority: data.priority || 'normal',
        dueDate: data.dueDate,
        projectId: data.projectId,
        assignedTo: data.assignedTo,
      },
    });

    return TaskMapper.toDomain(task);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    return task ? TaskMapper.toDomain(task) : null;
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data,
    });

    return TaskMapper.toDomain(task);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  async list(filters?: ListTasksFilters): Promise<Task[]> {
    const where: any = {};

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return TaskMapper.toDomainList(tasks);
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return TaskMapper.toDomainList(tasks);
  }
}
