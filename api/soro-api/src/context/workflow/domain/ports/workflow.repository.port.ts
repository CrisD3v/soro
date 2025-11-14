import { WorkflowEntity } from '../entities/workflow.entity';

export interface WorkflowRepositoryPort {
  create(workflow: {
    companyId: string;
    name: string;
    description: string | null;
    trigger: string;
    triggerConfig: Record<string, any>;
    isActive: boolean;
    createdBy: string;
  }): Promise<WorkflowEntity>;
  findById(id: string): Promise<WorkflowEntity | null>;
  findByCompany(companyId: string): Promise<WorkflowEntity[]>;
  update(id: string, data: Partial<WorkflowEntity>): Promise<WorkflowEntity>;
  delete(id: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<WorkflowEntity>;
}
