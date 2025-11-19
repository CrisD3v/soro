'use client';

/**
 * DealForm Component
 * Formulario para crear/editar deals con validación
 */

import { CompanySelect } from '@/components/molecules/CompanySelect';
import { ContactSelect } from '@/components/molecules/ContactSelect';
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
import { DealStage } from '@/lib/api/deal.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DealFormProps } from './DealForm.types';

// Schema de validación con Zod
const dealFormSchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string().optional().nullable(),
  value: z
    .number()
    .min(0, 'El valor debe ser mayor o igual a 0'),
  stage: z.nativeEnum(DealStage).optional(),
  probability: z
    .number()
    .min(0, 'La probabilidad debe ser entre 0 y 100')
    .max(100, 'La probabilidad debe ser entre 0 y 100')
    .optional(),
  expectedCloseDate: z.string().optional().nullable(),
  contactId: z.string().min(1, 'El contacto es requerido'),
  companyId: z.string().min(1, 'La empresa es requerida'),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

const stageLabels: Record<DealStage, string> = {
  [DealStage.LEAD]: 'Lead',
  [DealStage.QUALIFIED]: 'Calificado',
  [DealStage.PROPOSAL]: 'Propuesta',
  [DealStage.NEGOTIATION]: 'Negociación',
  [DealStage.CLOSED_WON]: 'Ganado',
  [DealStage.CLOSED_LOST]: 'Perdido',
};

export const DealForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: DealFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      value: initialData?.value || 0,
      stage: initialData?.stage || DealStage.LEAD,
      probability: initialData?.probability || 50,
      expectedCloseDate: initialData?.expectedCloseDate || '',
      contactId: initialData?.contactId || '',
      companyId: initialData?.companyId || '',
    },
  });

  const companyId = watch('companyId');
  const contactId = watch('contactId');
  const stage = watch('stage');

  const handleFormSubmit = (values: DealFormValues) => {
    onSubmit({
      ...values,
      description: values.description || null,
      expectedCloseDate: values.expectedCloseDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Título y Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Deal</Label>
          <Input
            id="title"
            placeholder="Venta de Software Empresarial"
            {...register('title')}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactId">Contacto</Label>
          <ContactSelect
            value={contactId}
            onValueChange={(value) => setValue('contactId', value)}
            disabled={isSubmitting}
            placeholder="Selecciona un contacto"
            companyId={companyId}
          />
          {errors.contactId && (
            <p className="text-sm text-red-500">{errors.contactId.message}</p>
          )}
        </div>
      </div>

      {/* Empresa */}
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

      {/* Valor y Probabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Valor (USD)</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            placeholder="10000"
            {...register('value', { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {errors.value && (
            <p className="text-sm text-red-500">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">
            Probabilidad (%) <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            placeholder="50"
            {...register('probability', { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {errors.probability && (
            <p className="text-sm text-red-500">{errors.probability.message}</p>
          )}
        </div>
      </div>

      {/* Etapa y Fecha Esperada de Cierre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stage">Etapa</Label>
          <Select
            value={stage}
            onValueChange={(value) => setValue('stage', value as DealStage)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona etapa" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(stageLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage && (
            <p className="text-sm text-red-500">{errors.stage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedCloseDate">
            Fecha Esperada de Cierre <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="expectedCloseDate"
            type="date"
            {...register('expectedCloseDate')}
            disabled={isSubmitting}
          />
          {errors.expectedCloseDate && (
            <p className="text-sm text-red-500">{errors.expectedCloseDate.message}</p>
          )}
        </div>
      </div>

      {/* Descripción - Ancho completo */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descripción <span className="text-gray-500 text-xs">(Opcional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Detalles del deal..."
          {...register('description')}
          disabled={isSubmitting}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
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
            initialData ? 'Actualizar Deal' : 'Crear Deal'
          )}
        </Button>
      </div>
    </form>
  );
};
