import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteSettingUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(id: string): Promise<void> {
    const existing = await this.settingRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }

    await this.settingRepository.delete(id);
  }
}
