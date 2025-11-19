export enum SettingCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  NOTIFICATIONS = 'NOTIFICATIONS',
  BILLING = 'BILLING',
  INTEGRATIONS = 'INTEGRATIONS',
  APPEARANCE = 'APPEARANCE',
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: SettingCategory;
  isPublic: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
