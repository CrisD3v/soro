import { Inject, Injectable } from '@nestjs/common';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';
import type { WorkflowRepositoryPort } from '../../domain/ports/workflow.repository.port';

@Injectable()
export class ListWorkflowsUseCase {
  constructor(
    @Inject('WorkflowRepositoryPort')
    private readonly workflowRepository: WorkflowRepositoryPort,
  ) { }

  async execute(companyId: string): Promise<WorkflowEntity[]> {
    return this.workflowRepository.findByCompany(companyId);
  }
}
