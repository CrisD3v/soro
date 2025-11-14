/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DocumentResponseDto } from '../../application/dto/document-response.dto';
import { DocumentEntity } from '../../domain/entities/document.entity';

export class DocumentMapper {
  static toDomain(raw: any): DocumentEntity {
    const fileName = (raw.fileUrl as string).split('/').pop() || 'unknown';
    return new DocumentEntity({
      id: raw.id as string,
      name: raw.name as string,
      fileName,
      filePath: raw.fileUrl as string,
      fileSize: Number(raw.fileSize),
      mimeType: raw.mimeType as string,
      projectId: raw.projectId as string | undefined,
      uploadedBy: raw.uploadedBy as string,
      companyId: raw.companyId as string,
      version: 1,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    });
  }

  static toResponse(entity: DocumentEntity): DocumentResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      fileName: entity.fileName,
      filePath: entity.filePath,
      fileSize: entity.fileSize,
      mimeType: entity.mimeType,
      projectId: entity.projectId,
      uploadedBy: entity.uploadedBy,
      companyId: entity.companyId,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
