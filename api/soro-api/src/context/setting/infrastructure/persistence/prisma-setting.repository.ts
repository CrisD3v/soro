import { Setting } from '@context/setting/domain/entities/setting.entity';
import {
  CreateSettingData,
  ListSettingsFilters,
  SettingRepositoryPort,
  UpdateSettingData,
} from '@context/setting/domain/ports/setting.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SettingMapper } from '../mappers/setting.mapper';

@Injectable()
export class PrismaSettingRepository implements SettingRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateSettingData): Promise<Setting> {
    const setting = await this.prisma.setting.create({
      data: {
        key: data.key,
        value: data.value,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic ?? false,
        companyId: data.companyId,
      },
    });

    return SettingMapper.toDomain(setting);
  }

  async findById(id: string): Promise<Setting | null> {
    const setting = await this.prisma.setting.findUnique({
      where: { id },
    });

    return setting ? SettingMapper.toDomain(setting) : null;
  }

  async findByKey(key: string, companyId: string): Promise<Setting | null> {
    const setting = await this.prisma.setting.findUnique({
      where: {
        key_companyId: {
          key,
          companyId,
        },
      },
    });

    return setting ? SettingMapper.toDomain(setting) : null;
  }

  async update(id: string, data: UpdateSettingData): Promise<Setting> {
    const setting = await this.prisma.setting.update({
      where: { id },
      data,
    });

    return SettingMapper.toDomain(setting);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.setting.delete({
      where: { id },
    });
  }

  async list(filters?: ListSettingsFilters): Promise<Setting[]> {
    const where: any = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters?.search) {
      where.OR = [
        { key: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const settings = await this.prisma.setting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return SettingMapper.toDomainList(settings);
  }
}
