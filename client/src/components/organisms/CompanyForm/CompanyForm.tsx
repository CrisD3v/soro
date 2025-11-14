'use client';

/**
 * CompanyForm Component
 * Formulario para crear/editar empresas con validación
 */

import { CompanySelect } from '@/components/molecules/CompanySelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { CompanyFormProps } from './CompanyForm.types';

// Schema de validación con Zod
const companyFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  nit: z
    .string()
    .min(5, 'El NIT debe tener al menos 5 caracteres')
    .max(20, 'El NIT no puede exceder 20 caracteres')
    .regex(/^[0-9-]+$/, 'El NIT solo puede contener números y guiones'),
  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres')
    .regex(/^\+?[0-9]+$/, 'El teléfono solo puede contener números y +'),
  parentId: z
    .string()
    .optional()
    .nullable(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const CompanyForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: CompanyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      nit: initialData?.nit || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      parentId: initialData?.parentId || null,
    },
  });

  const parentId = watch('parentId');

  const handleFormSubmit = (values: CompanyFormValues) => {
    onSubmit({
      ...values,
      parentId: values.parentId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nombre y NIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Empresa</Label>
          <Input
            id="name"
            placeholder="Empresa S.A.S."
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nit">NIT</Label>
          <Input
            id="nit"
            placeholder="900123456-7"
            {...register('nit')}
            disabled={isSubmitting}
          />
          {errors.nit && (
            <p className="text-sm text-red-500">{errors.nit.message}</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          placeholder="Calle 123 #45-67, Ciudad, País"
          {...register('address')}
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Teléfono y Empresa Padre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+573001234567"
            {...register('phone')}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentId">Empresa Padre (Opcional)</Label>
          <CompanySelect
            value={parentId || ''}
            onValueChange={(value) => setValue('parentId', value || null)}
            disabled={isSubmitting}
            placeholder="Selecciona empresa padre"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Deja vacío si es una empresa independiente
          </p>
          {errors.parentId && (
            <p className="text-sm text-red-500">{errors.parentId.message}</p>
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
              Creando...
            </>
          ) : (
            'Crear Empresa'
          )}
        </Button>
      </div>
    </form>
  );
};
