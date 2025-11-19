/**
 * SettingForm Types
 */

import type { CreateSettingDto, Setting } from '@/lib/api/setting.types';

export interface SettingFormProps {
  setting?: Setting;
  onSubmit: (data: CreateSettingDto) => void;
  isLoading?: boolean;
}
