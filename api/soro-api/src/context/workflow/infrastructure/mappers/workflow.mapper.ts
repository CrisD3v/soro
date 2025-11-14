import { Workflow as PrismaWorkflow } from '@prisma/client';
import { WorkflowResponseDto } from '../../application/dto/workflow-response.dto';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';

export class WorkflowMapper {
  static toDomain(prismaWorkflow: PrismaWorkflow): WorkflowEntity {
    return new WorkflowEntity(
      prismaWorkflow.id,
      prismaWorkflow.companyId,
      prismaWorkflow.name,
      prismaWorkflow.description,
      prismaWorkflow.trigger,
      prismaWorkflow.triggerConfig as Record<string, any>,
      prismaWorkflow.isActive,
      prismaWorkflow.createdBy,
      prismaWorkflow.createdAt,
      prismaWorkflow.updatedAt,
    );
  }

  static toResponse(entity: WorkflowEntity): WorkflowResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      description: entity.description,
      trigger: entity.trigger,
      triggerConfig: entity.triggerConfig,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
