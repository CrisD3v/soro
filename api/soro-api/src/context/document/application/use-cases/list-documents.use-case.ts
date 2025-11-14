import { Inject, Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../domain/entities/document.entity';
import type { DocumentRepositoryPort } from '../../domain/ports/document.repository.port';

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject('DocumentRepositoryPort')
    private readonly documentRepository: DocumentRepositoryPort,
  ) { }

  async execute(companyId: string, projectId?: string): Promise<DocumentEntity[]> {
    if (projectId) {
      return this.documentRepository.findByProject(projectId, companyId);
    }
    return this.documentRepository.findByCompany(companyId);
  }
}
