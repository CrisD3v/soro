import { Setting } from '@context/setting/domain/entities/setting.entity';
import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetSettingUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(id: string): Promise<Setting> {
    const setting = await this.settingRepository.findById(id);

    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }

    return setting;
  }
}
