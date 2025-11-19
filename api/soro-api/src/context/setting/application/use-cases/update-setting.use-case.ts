import { Setting } from '@context/setting/domain/entities/setting.entity';
import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Injectable()
export class UpdateSettingUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(id: string, dto: UpdateSettingDto): Promise<Setting> {
    const existing = await this.settingRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }

    return this.settingRepository.update(id, dto);
  }
}
