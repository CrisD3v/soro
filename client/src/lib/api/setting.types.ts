/**
 * Setting Types
 * Tipos para el módulo de configuración del sistema
 */

export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  category: SettingCategory;
  isPublic: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export enum SettingCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  NOTIFICATIONS = 'NOTIFICATIONS',
  BILLING = 'BILLING',
  INTEGRATIONS = 'INTEGRATIONS',
  APPEARANCE = 'APPEARANCE',
}

export interface CreateSettingDto {
  key: string;
  value: string;
  description?: string;
  category: SettingCategory;
  isPublic?: boolean;
  companyId: string;
}

export interface UpdateSettingDto {
  value?: string;
  description?: string;
  category?: SettingCategory;
  isPublic?: boolean;
}

export interface SettingFilters {
  companyId?: string;
  category?: SettingCategory;
  isPublic?: boolean;
  search?: string;
}

// Labels en español para categorías
export const SETTING_CATEGORY_LABELS: Record<SettingCategory, string> = {
  [SettingCategory.GENERAL]: 'General',
  [SettingCategory.SECURITY]: 'Seguridad',
  [SettingCategory.NOTIFICATIONS]: 'Notificaciones',
  [SettingCategory.BILLING]: 'Facturación',
  [SettingCategory.INTEGRATIONS]: 'Integraciones',
  [SettingCategory.APPEARANCE]: 'Apariencia',
};

// Colores para categorías
export const SETTING_CATEGORY_COLORS: Record<SettingCategory, string> = {
  [SettingCategory.GENERAL]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [SettingCategory.SECURITY]: 'bg-red-500/10 text-red-400 border-red-500/20',
  [SettingCategory.NOTIFICATIONS]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [SettingCategory.BILLING]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [SettingCategory.INTEGRATIONS]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [SettingCategory.APPEARANCE]: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};
