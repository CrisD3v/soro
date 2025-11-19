'use client';

/**
 * WorkflowForm Component
 * Formulario para crear/editar workflows de automatización
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
import { Textarea } from '@/components/ui/textarea';
import type { CreateWorkflowDto } from '@/lib/api/workflow.types';
import { WORKFLOW_CONFIG_EXAMPLES, WORKFLOW_TRIGGER_LABELS, WorkflowTriggerType } from '@/lib/api/workflow.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { WorkflowFormProps } from './WorkflowForm.types';

// Schema de validación
const workflowSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().optional(),
  triggerType: z.nativeEnum(WorkflowTriggerType),
  config: z.string().min(2, 'La configuración es requerida'),
  isActive: z.boolean(),
  companyId: z.string().uuid('Debe seleccionar una empresa válida'),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

export const WorkflowForm = ({ workflow, onSubmit, isLoading = false }: WorkflowFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: workflow
      ? {
        name: workflow.name,
        description: workflow.description || '',
        triggerType: workflow.triggerType,
        config: JSON.stringify(workflow.config, null, 2),
        isActive: workflow.isActive,
        companyId: workflow.companyId,
      }
      : {
        isActive: true,
        config: JSON.stringify(WORKFLOW_CONFIG_EXAMPLES[WorkflowTriggerType.MANUAL], null, 2),
      },
  });

  const triggerType = watch('triggerType');
  const companyId = watch('companyId');
  const isActive = watch('isActive');

  // Actualizar config cuando cambia el trigger type
  const handleTriggerTypeChange = (value: WorkflowTriggerType) => {
    setValue('triggerType', value);
    const exampleConfig = WORKFLOW_CONFIG_EXAMPLES[value];
    setValue('config', JSON.stringify(exampleConfig, null, 2));
  };

  const handleFormSubmit = (data: WorkflowFormData) => {
    try {
      const config = JSON.parse(data.config);
      onSubmit({
        ...data,
        config,
      } as CreateWorkflowDto);
    } catch (error) {
      alert('Error: La configuración debe ser un JSON válido');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Fila 1: Nombre y Tipo de Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Workflow</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="ej: Bienvenida a nuevos usuarios"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="triggerType">Tipo de Trigger</Label>
          <Select
            value={triggerType}
            onValueChange={handleTriggerTypeChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(WorkflowTriggerType).map((type) => (
                <SelectItem key={type} value={type}>
                  {WORKFLOW_TRIGGER_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.triggerType && (
            <p className="text-sm text-red-400">{errors.triggerType.message}</p>
          )}
        </div>
      </div>

      {/* Fila 2: Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción (Opcional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descripción del workflow"
          rows={2}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Fila 3: Configuración JSON */}
      <div className="space-y-2">
        <Label htmlFor="config">Configuración (JSON)</Label>
        <Textarea
          id="config"
          {...register('config')}
          placeholder='{"key": "value"}'
          rows={10}
          disabled={isLoading}
          className="font-mono text-sm"
        />
        {errors.config && (
          <p className="text-sm text-red-400">{errors.config.message}</p>
        )}
        <p className="text-xs text-white/60">
          Configuración en formato JSON. Cambia automáticamente según el tipo de trigger.
        </p>
      </div>

      {/* Fila 4: Empresa y Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyId">Empresa</Label>
          <CompanySelect
            value={companyId}
            onValueChange={(value) => setValue('companyId', value)}
            disabled={isLoading || !!workflow}
          />
          {errors.companyId && (
            <p className="text-sm text-red-400">{errors.companyId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isActive">Estado</Label>
          <Select
            value={isActive ? 'true' : 'false'}
            onValueChange={(value) => setValue('isActive', value === 'true')}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Activo</SelectItem>
              <SelectItem value="false">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-white/60">
            Los workflows inactivos no se ejecutarán
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Guardando...' : workflow ? 'Actualizar' : 'Crear'} Workflow
        </Button>
      </div>
    </form>
  );
};
