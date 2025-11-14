import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CustomFieldEntity } from '../../domain/entities/custom-field.entity';
import { CustomFieldRepositoryPort } from '../../domain/ports/custom-field.repository.port';
import { CustomFieldMapper } from '../mappers/custom-field.mapper';

@Injectable()
export class PrismaCustomFieldRepository implements CustomFieldRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(field: Omit<CustomFieldEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomFieldEntity> {
    const created = await this.prisma.customField.create({
      data: {
        companyId: field.companyId,
        entity: field.entity,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        fieldConfig: field.fieldConfig,
        isRequired: field.isRequired,
        isActive: field.isActive,
      },
    });
    return CustomFieldMapper.toDomain(created);
  }

  async findById(id: string): Promise<CustomFieldEntity | null> {
    const field = await this.prisma.customField.findUnique({ where: { id } });
    return field ? CustomFieldMapper.toDomain(field) : null;
  }

  async findByCompany(companyId: string): Promise<CustomFieldEntity[]> {
    const fields = await this.prisma.customField.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return fields.map(CustomFieldMapper.toDomain);
  }

  async findByEntity(companyId: string, entity: string): Promise<CustomFieldEntity[]> {
    const fields = await this.prisma.customField.findMany({
      where: { companyId, entity },
      orderBy: { createdAt: 'desc' },
    });
    return fields.map(CustomFieldMapper.toDomain);
  }

  async update(id: string, data: Partial<CustomFieldEntity>): Promise<CustomFieldEntity> {
    const updated = await this.prisma.customField.update({
      where: { id },
      data: {
        ...(data.fieldName && { fieldName: data.fieldName }),
        ...(data.fieldType && { fieldType: data.fieldType }),
        ...(data.fieldConfig && { fieldConfig: data.fieldConfig }),
        ...(data.isRequired !== undefined && { isRequired: data.isRequired }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return CustomFieldMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customField.delete({ where: { id } });
  }
}
