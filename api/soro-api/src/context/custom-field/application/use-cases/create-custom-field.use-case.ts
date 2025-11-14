import { Inject, Injectable } from '@nestjs/common';
import { CustomFieldEntity } from '../../domain/entities/custom-field.entity';
import type { CustomFieldRepositoryPort } from '../../domain/ports/custom-field.repository.port';
import { CreateCustomFieldDto } from '../dto/create-custom-field.dto';

@Injectable()
export class CreateCustomFieldUseCase {
  constructor(
    @Inject('CustomFieldRepositoryPort')
    private readonly customFieldRepository: CustomFieldRepositoryPort,
  ) { }

  async execute(dto: CreateCustomFieldDto): Promise<CustomFieldEntity> {
    return this.customFieldRepository.create({
      companyId: dto.companyId,
      entity: dto.entity,
      fieldName: dto.fieldName,
      fieldType: dto.fieldType,
      fieldConfig: dto.fieldConfig || {},
      isRequired: dto.isRequired || false,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });
  }
}
