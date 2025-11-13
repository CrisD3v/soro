import { Task } from '@context/task/domain/entities/task.entity';
import { Task as PrismaTask } from '@prisma/client';

export class TaskMapper {
  static toDomain(prismaTask: PrismaTask): Task {
    return new Task(
      prismaTask.id,
      prismaTask.title,
      prismaTask.description,
      prismaTask.status,
      prismaTask.priority,
      prismaTask.dueDate,
      prismaTask.projectId,
      prismaTask.assignedTo,
      prismaTask.createdAt,
      prismaTask.updatedAt,
    );
  }

  static toDomainList(prismaTasks: PrismaTask[]): Task[] {
    return prismaTasks.map((task) => this.toDomain(task));
  }
}
