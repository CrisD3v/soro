import { Inject, Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../domain/entities/document.entity';
import type { DocumentRepositoryPort } from '../../domain/ports/document.repository.port';
import { UploadDocumentDto } from '../dto/upload-document.dto';

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject('DocumentRepositoryPort')
    private readonly documentRepository: DocumentRepositoryPort,
  ) { }

  async execute(dto: UploadDocumentDto, userId: string, companyId: string): Promise<DocumentEntity> {
    const document = new DocumentEntity({
      name: dto.name,
      fileName: dto.fileName,
      filePath: dto.filePath,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      projectId: dto.projectId,
      uploadedBy: userId,
      companyId,
      version: 1,
    });

    return this.documentRepository.create(document);
  }
}
