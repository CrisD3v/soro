/**
 * Types para el componente PasswordInput
 */

import type { InputHTMLAttributes } from 'react';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}
