import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { UploadDocumentUseCase } from './application/use-cases/upload-document.use-case';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { PrismaDocumentRepository } from './infrastructure/persistence/prisma-document.repository';

@Module({
  controllers: [DocumentController],
  providers: [
    PrismaService,
    {
      provide: 'DocumentRepositoryPort',
      useClass: PrismaDocumentRepository,
    },
    UploadDocumentUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
  ],
  exports: [UploadDocumentUseCase, ListDocumentsUseCase],
})
export class DocumentModule { }
