import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CustomFieldRepositoryPort } from '../../domain/ports/custom-field.repository.port';

@Injectable()
export class DeleteCustomFieldUseCase {
  constructor(
    @Inject('CustomFieldRepositoryPort')
    private readonly customFieldRepository: CustomFieldRepositoryPort,
  ) { }

  async execute(id: string): Promise<void> {
    const field = await this.customFieldRepository.findById(id);
    if (!field) {
      throw new NotFoundException(`Custom field with ID ${id} not found`);
    }

    await this.customFieldRepository.delete(id);
  }
}
