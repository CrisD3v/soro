import { Setting } from '@context/setting/domain/entities/setting.entity';
import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from '../dto/create-setting.dto';

@Injectable()
export class CreateSettingUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(dto: CreateSettingDto): Promise<Setting> {
    // Verificar si ya existe una configuración con la misma clave para esta empresa
    const existing = await this.settingRepository.findByKey(dto.key, dto.companyId);
    if (existing) {
      throw new Error(`Setting with key "${dto.key}" already exists for this company`);
    }

    return this.settingRepository.create({
      key: dto.key,
      value: dto.value,
      description: dto.description,
      category: dto.category,
      isPublic: dto.isPublic ?? false,
      companyId: dto.companyId,
    });
  }
}
