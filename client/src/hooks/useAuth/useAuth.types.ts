/**
 * Types para el hook useAuth
 */

import type { UserData } from '@/lib/api/auth.types';

export interface UseAuthReturn {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}
