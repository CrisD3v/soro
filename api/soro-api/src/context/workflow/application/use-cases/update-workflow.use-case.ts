import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';
import type { WorkflowRepositoryPort } from '../../domain/ports/workflow.repository.port';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';

@Injectable()
export class UpdateWorkflowUseCase {
  constructor(
    @Inject('WorkflowRepositoryPort')
    private readonly workflowRepository: WorkflowRepositoryPort,
  ) { }

  async execute(id: string, dto: UpdateWorkflowDto): Promise<WorkflowEntity> {
    const workflow = await this.workflowRepository.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    return this.workflowRepository.update(id, dto);
  }
}
