import { Inject, Injectable } from '@nestjs/common';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';
import type { WorkflowRepositoryPort } from '../../domain/ports/workflow.repository.port';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';

@Injectable()
export class CreateWorkflowUseCase {
  constructor(
    @Inject('WorkflowRepositoryPort')
    private readonly workflowRepository: WorkflowRepositoryPort,
  ) { }

  async execute(dto: CreateWorkflowDto): Promise<WorkflowEntity> {
    return this.workflowRepository.create({
      companyId: dto.companyId,
      name: dto.name,
      description: dto.description || null,
      trigger: dto.trigger,
      triggerConfig: dto.triggerConfig || {},
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      createdBy: dto.createdBy,
    });
  }
}
