/**
 * Types para el componente FormField
 */

import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}
