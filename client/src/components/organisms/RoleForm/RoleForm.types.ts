/**
 * RoleForm Types
 */

import type { CreateRoleDto } from '@/lib/api/role.types';

export interface RoleFormProps {
  /**
   * Callback cuando se envía el formulario
   */
  onSubmit: (data: CreateRoleDto) => void;

  /**
   * Indica si el formulario está enviando datos
   */
  isSubmitting?: boolean;

  /**
   * Datos iniciales del formulario (para edición)
   */
  initialData?: Partial<CreateRoleDto>;

  /**
   * Callback cuando se cancela
   */
  onCancel?: () => void;
}
