import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';
import { WorkflowRepositoryPort } from '../../domain/ports/workflow.repository.port';
import { WorkflowMapper } from '../mappers/workflow.mapper';

@Injectable()
export class PrismaWorkflowRepository implements WorkflowRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(workflow: Omit<WorkflowEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowEntity> {
    const created = await this.prisma.workflow.create({
      data: {
        companyId: workflow.companyId,
        name: workflow.name,
        description: workflow.description,
        trigger: workflow.trigger,
        triggerConfig: workflow.triggerConfig,
        isActive: workflow.isActive,
        createdBy: workflow.createdBy,
      },
    });
    return WorkflowMapper.toDomain(created);
  }

  async findById(id: string): Promise<WorkflowEntity | null> {
    const workflow = await this.prisma.workflow.findUnique({ where: { id } });
    return workflow ? WorkflowMapper.toDomain(workflow) : null;
  }

  async findByCompany(companyId: string): Promise<WorkflowEntity[]> {
    const workflows = await this.prisma.workflow.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return workflows.map(WorkflowMapper.toDomain);
  }

  async update(id: string, data: Partial<WorkflowEntity>): Promise<WorkflowEntity> {
    const updated = await this.prisma.workflow.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.trigger && { trigger: data.trigger }),
        ...(data.triggerConfig && { triggerConfig: data.triggerConfig }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return WorkflowMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workflow.delete({ where: { id } });
  }

  async toggleActive(id: string, isActive: boolean): Promise<WorkflowEntity> {
    const updated = await this.prisma.workflow.update({
      where: { id },
      data: { isActive },
    });
    return WorkflowMapper.toDomain(updated);
  }
}
