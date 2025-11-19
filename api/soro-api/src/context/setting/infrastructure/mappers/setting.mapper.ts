import { Setting, SettingCategory } from '@context/setting/domain/entities/setting.entity';
import { Setting as PrismaSetting } from '@prisma/client';

export class SettingMapper {
  static toDomain(prisma: PrismaSetting): Setting {
    return {
      id: prisma.id,
      key: prisma.key,
      value: prisma.value,
      description: prisma.description || undefined,
      category: prisma.category as SettingCategory,
      isPublic: prisma.isPublic,
      companyId: prisma.companyId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
  }

  static toDomainList(prismaList: PrismaSetting[]): Setting[] {
    return prismaList.map((prisma) => this.toDomain(prisma));
  }
}
