import { Inject, Injectable } from '@nestjs/common';
import { CustomFieldEntity } from '../../domain/entities/custom-field.entity';
import type { CustomFieldRepositoryPort } from '../../domain/ports/custom-field.repository.port';

@Injectable()
export class ListCustomFieldsUseCase {
  constructor(
    @Inject('CustomFieldRepositoryPort')
    private readonly customFieldRepository: CustomFieldRepositoryPort,
  ) { }

  async execute(companyId: string, entity?: string): Promise<CustomFieldEntity[]> {
    if (entity) {
      return this.customFieldRepository.findByEntity(companyId, entity);
    }
    return this.customFieldRepository.findByCompany(companyId);
  }
}
