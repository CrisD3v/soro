import { Setting, SettingCategory } from '@context/setting/domain/entities/setting.entity';
import { SettingRepositoryPort } from '@context/setting/domain/ports/setting.repository.port';
import { Injectable } from '@nestjs/common';

export interface ListSettingsFilters {
  companyId?: string;
  category?: SettingCategory;
  isPublic?: boolean;
  search?: string;
}

@Injectable()
export class ListSettingsUseCase {
  constructor(private readonly settingRepository: SettingRepositoryPort) { }

  async execute(filters?: ListSettingsFilters): Promise<Setting[]> {
    return this.settingRepository.list(filters);
  }
}
