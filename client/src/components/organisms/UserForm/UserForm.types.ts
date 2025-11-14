/**
 * UserForm Types
 */

import type { CreateUserDto } from '@/lib/api/user.types';

export interface UserFormProps {
  /**
   * Callback cuando se envía el formulario
   */
  onSubmit: (data: CreateUserDto) => void;

  /**
   * Indica si el formulario está enviando datos
   */
  isSubmitting?: boolean;

  /**
   * Datos iniciales del formulario (para edición)
   */
  initialData?: Partial<CreateUserDto>;

  /**
   * Callback cuando se cancela
   */
  onCancel?: () => void;
}
