import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomFieldEntity } from '../../domain/entities/custom-field.entity';
import type { CustomFieldRepositoryPort } from '../../domain/ports/custom-field.repository.port';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';

@Injectable()
export class UpdateCustomFieldUseCase {
  constructor(
    @Inject('CustomFieldRepositoryPort')
    private readonly customFieldRepository: CustomFieldRepositoryPort,
  ) { }

  async execute(id: string, dto: UpdateCustomFieldDto): Promise<CustomFieldEntity> {
    const field = await this.customFieldRepository.findById(id);
    if (!field) {
      throw new NotFoundException(`Custom field with ID ${id} not found`);
    }

    return this.customFieldRepository.update(id, dto);
  }
}
