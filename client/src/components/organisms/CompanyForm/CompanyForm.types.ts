/**
 * CompanyForm Types
 */

import type { CreateCompanyDto } from '@/lib/api/company.types';

export interface CompanyFormProps {
  /**
   * Callback cuando se envía el formulario
   */
  onSubmit: (data: CreateCompanyDto) => void;

  /**
   * Indica si el formulario está enviando datos
   */
  isSubmitting?: boolean;

  /**
   * Datos iniciales del formulario (para edición)
   */
  initialData?: Partial<CreateCompanyDto>;

  /**
   * Callback cuando se cancela
   */
  onCancel?: () => void;
}
