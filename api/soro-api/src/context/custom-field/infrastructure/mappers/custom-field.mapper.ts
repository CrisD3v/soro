import { CustomField as PrismaCustomField } from '@prisma/client';
import { CustomFieldResponseDto } from '../../application/dto/custom-field-response.dto';
import { CustomFieldEntity } from '../../domain/entities/custom-field.entity';

export class CustomFieldMapper {
  static toDomain(prismaField: PrismaCustomField): CustomFieldEntity {
    return new CustomFieldEntity(
      prismaField.id,
      prismaField.companyId,
      prismaField.entity,
      prismaField.fieldName,
      prismaField.fieldType,
      prismaField.fieldConfig as Record<string, any>,
      prismaField.isRequired,
      prismaField.isActive,
      prismaField.createdAt,
      prismaField.updatedAt,
    );
  }

  static toResponse(entity: CustomFieldEntity): CustomFieldResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      entity: entity.entity,
      fieldName: entity.fieldName,
      fieldType: entity.fieldType,
      fieldConfig: entity.fieldConfig,
      isRequired: entity.isRequired,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
