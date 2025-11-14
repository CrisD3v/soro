import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DocumentRepositoryPort } from '../../domain/ports/document.repository.port';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject('DocumentRepositoryPort')
    private readonly documentRepository: DocumentRepositoryPort,
  ) { }

  async execute(documentId: string, companyId: string): Promise<void> {
    const document = await this.documentRepository.findById(documentId, companyId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.documentRepository.delete(documentId, companyId);
  }
}
