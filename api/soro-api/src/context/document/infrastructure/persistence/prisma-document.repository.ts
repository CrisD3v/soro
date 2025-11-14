/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DocumentEntity } from '../../domain/entities/document.entity';
import type { DocumentRepositoryPort } from '../../domain/ports/document.repository.port';
import { DocumentMapper } from '../mappers/document.mapper';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(document: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const data = await this.prisma.document.create({
      data: {
        name: document.name!,
        type: 'general',
        fileUrl: document.filePath!,
        fileSize: BigInt(document.fileSize!),
        mimeType: document.mimeType!,
        projectId: document.projectId,
        uploadedBy: document.uploadedBy!,
        companyId: document.companyId!,
      },
    });

    return DocumentMapper.toDomain(data);
  }

  async findById(id: string, companyId: string): Promise<DocumentEntity | null> {
    const data = await this.prisma.document.findFirst({
      where: { id, companyId },
    });

    return data ? DocumentMapper.toDomain(data) : null;
  }

  async findByProject(projectId: string, companyId: string): Promise<DocumentEntity[]> {
    const data = await this.prisma.document.findMany({
      where: { projectId, companyId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((doc) => DocumentMapper.toDomain(doc));
  }

  async findByCompany(companyId: string): Promise<DocumentEntity[]> {
    const data = await this.prisma.document.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((doc) => DocumentMapper.toDomain(doc));
  }

  async update(id: string, companyId: string, updateData: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const data = await this.prisma.document.update({
      where: { id },
      data: {
        name: updateData.name,
        type: updateData.mimeType?.includes('pdf') ? 'report' : 'general',
      },
    });

    return DocumentMapper.toDomain(data);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id },
    });
  }
}
