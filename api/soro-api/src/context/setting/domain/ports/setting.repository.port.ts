import { Setting, SettingCategory } from '../entities/setting.entity';

export interface CreateSettingData {
  key: string;
  value: string;
  description?: string;
  category: SettingCategory;
  isPublic?: boolean;
  companyId: string;
}

export interface UpdateSettingData {
  value?: string;
  description?: string;
  category?: SettingCategory;
  isPublic?: boolean;
}

export interface ListSettingsFilters {
  companyId?: string;
  category?: SettingCategory;
  isPublic?: boolean;
  search?: string;
}

export abstract class SettingRepositoryPort {
  abstract create(data: CreateSettingData): Promise<Setting>;
  abstract findById(id: string): Promise<Setting | null>;
  abstract findByKey(key: string, companyId: string): Promise<Setting | null>;
  abstract update(id: string, data: UpdateSettingData): Promise<Setting>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListSettingsFilters): Promise<Setting[]>;
}
