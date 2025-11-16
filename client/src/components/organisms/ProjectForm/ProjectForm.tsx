'use client';

/**
 * ProjectForm Component
 * Formulario para crear/editar proyectos con validación
 */

import { CompanySelect } from '@/components/molecules/CompanySelect';
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
import { ProjectStatus } from '@/lib/api/project.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ProjectFormProps } from './ProjectForm.types';

// Schema de validación con Zod
const projectFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  status: z.nativeEnum(ProjectStatus).optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional().nullable(),
  companyId: z.string().min(1, 'La empresa es requerida'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planificación',
  [ProjectStatus.IN_PROGRESS]: 'En Progreso',
  [ProjectStatus.ON_HOLD]: 'En Espera',
  [ProjectStatus.COMPLETED]: 'Completado',
  [ProjectStatus.CANCELLED]: 'Cancelado',
};

export const ProjectForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: initialData?.status || ProjectStatus.PLANNING,
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      companyId: initialData?.companyId || '',
    },
  });

  const companyId = watch('companyId');
  const status = watch('status');

  const handleFormSubmit = (values: ProjectFormValues) => {
    onSubmit({
      ...values,
      endDate: values.endDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nombre y Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Proyecto</Label>
          <Input
            id="name"
            placeholder="Proyecto Alpha"
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyId">Empresa</Label>
          <CompanySelect
            value={companyId}
            onValueChange={(value) => setValue('companyId', value)}
            disabled={isSubmitting}
            placeholder="Selecciona una empresa"
          />
          {errors.companyId && (
            <p className="text-sm text-red-500">{errors.companyId.message}</p>
          )}
        </div>
      </div>

      {/* Descripción - Ancho completo */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          placeholder="Descripción del proyecto"
          {...register('description')}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Estado, Fecha Inicio y Fecha Fin - Misma fila con anchos iguales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as ProjectStatus)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full min-w-0">
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

        <div className="space-y-2 min-w-0">
          <Label htmlFor="startDate">Fecha de Inicio</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
            disabled={isSubmitting}
            className="w-full min-w-0"
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="endDate">
            Fecha de Fin <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
            disabled={isSubmitting}
            className="w-full min-w-0"
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
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
            initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'
          )}
        </Button>
      </div>
    </form>
  );
};
