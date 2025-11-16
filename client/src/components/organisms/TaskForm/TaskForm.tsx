'use client';

/**
 * TaskForm Component
 * Formulario para crear/editar tareas con validación
 */

import { ProjectSelect } from '@/components/molecules/ProjectSelect';
import { UserSelect } from '@/components/molecules/UserSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskPriority, TaskStatus } from '@/lib/api/task.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { TaskFormProps } from './TaskForm.types';

// Schema de validación con Zod
const taskFormSchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().min(1, 'El proyecto es requerido'),
  assignedToId: z.string().optional().nullable(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Por Hacer',
  [TaskStatus.IN_PROGRESS]: 'En Progreso',
  [TaskStatus.IN_REVIEW]: 'En Revisión',
  [TaskStatus.DONE]: 'Completada',
  [TaskStatus.CANCELLED]: 'Cancelada',
};

const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Baja',
  [TaskPriority.MEDIUM]: 'Media',
  [TaskPriority.HIGH]: 'Alta',
  [TaskPriority.URGENT]: 'Urgente',
};

export const TaskForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || TaskStatus.TODO,
      priority: initialData?.priority || TaskPriority.MEDIUM,
      dueDate: initialData?.dueDate || '',
      projectId: initialData?.projectId || '',
      assignedToId: initialData?.assignedToId || '',
    },
  });

  const projectId = watch('projectId');
  const assignedToId = watch('assignedToId');
  const status = watch('status');
  const priority = watch('priority');

  const handleFormSubmit = (values: TaskFormValues) => {
    onSubmit({
      ...values,
      dueDate: values.dueDate || null,
      assignedToId: values.assignedToId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Título y Proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la Tarea</Label>
          <Input
            id="title"
            placeholder="Implementar funcionalidad X"
            {...register('title')}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId">Proyecto</Label>
          <ProjectSelect
            value={projectId}
            onValueChange={(value) => setValue('projectId', value)}
            disabled={isSubmitting}
            placeholder="Selecciona un proyecto"
          />
          {errors.projectId && (
            <p className="text-sm text-red-500">{errors.projectId.message}</p>
          )}
        </div>
      </div>

      {/* Descripción - Ancho completo */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          placeholder="Descripción detallada de la tarea"
          {...register('description')}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Estado y Prioridad - 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as TaskStatus)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona estado" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select
            value={priority}
            onValueChange={(value) => setValue('priority', value as TaskPriority)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona prioridad" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Fecha Límite y Asignado a - 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Fecha Límite <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedToId">
            Asignado a <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <UserSelect
            value={assignedToId || undefined}
            onValueChange={(value) => setValue('assignedToId', value)}
            disabled={isSubmitting}
            placeholder="Sin asignar"
          />
          {errors.assignedToId && (
            <p className="text-sm text-red-500">{errors.assignedToId.message}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              {initialData ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            initialData ? 'Actualizar Tarea' : 'Crear Tarea'
          )}
        </Button>
      </div>
    </form>
  );
};
