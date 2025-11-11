/**
 * Types para el componente LoginForm
 */

import type { LoginFormData } from '@/lib/utils/validators';

export interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToReset?: () => void;
}

export interface LoginFormState extends LoginFormData {
  rememberMe?: boolean;
}
