import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { WorkflowRepositoryPort } from '../../domain/ports/workflow.repository.port';

@Injectable()
export class DeleteWorkflowUseCase {
  constructor(
    @Inject('WorkflowRepositoryPort')
    private readonly workflowRepository: WorkflowRepositoryPort,
  ) { }

  async execute(id: string): Promise<void> {
    const workflow = await this.workflowRepository.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    await this.workflowRepository.delete(id);
  }
}
