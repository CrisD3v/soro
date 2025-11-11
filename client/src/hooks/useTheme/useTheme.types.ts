/**
 * Types para el hook useTheme
 */

import type { Theme } from '@/lib/types/common.types';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}
