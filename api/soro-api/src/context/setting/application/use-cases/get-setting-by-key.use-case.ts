import { Setting } from '@context/setting/domain/entities/setting.entity';
import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetSettingByKeyUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(key: string, companyId: string): Promise<Setting> {
    const setting = await this.settingRepository.findByKey(key, companyId);

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found for this company`);
    }

    return setting;
  }
}
