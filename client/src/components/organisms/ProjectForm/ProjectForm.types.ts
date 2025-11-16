/**
 * ProjectForm Types
 */

import type { CreateProjectDto } from '@/lib/api/project.types';

export interface ProjectFormProps {
  /**
   * Callback cuando se envía el formulario
   */
  onSubmit: (data: CreateProjectDto) => void;

  /**
   * Indica si el formulario está enviando datos
   */
  isSubmitting?: boolean;

  /**
   * Datos iniciales del formulario (para edición)
   */
  initialData?: Partial<CreateProjectDto>;

  /**
   * Callback cuando se cancela
   */
  onCancel?: () => void;
}
