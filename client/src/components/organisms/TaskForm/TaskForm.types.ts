/**
 * TaskForm Component Types
 */

import type { CreateTaskDto, Task } from '@/lib/api/task.types';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  isSubmitting?: boolean;
  initialData?: Partial<Task>;
  onCancel?: () => void;
}
