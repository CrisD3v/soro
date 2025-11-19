'use client';

/**
 * ContactForm Component
 * Formulario para crear/editar contactos con validación
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
import { ContactSource, ContactStatus } from '@/lib/api/contact.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ContactFormProps } from './ContactForm.types';

// Schema de validación con Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  position: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  status: z.nativeEnum(ContactStatus).optional(),
  source: z.nativeEnum(ContactSource).optional(),
  notes: z.string().optional().nullable(),
  companyId: z.string().min(1, 'La empresa es requerida'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const statusLabels: Record<ContactStatus, string> = {
  [ContactStatus.LEAD]: 'Lead',
  [ContactStatus.QUALIFIED]: 'Calificado',
  [ContactStatus.CUSTOMER]: 'Cliente',
  [ContactStatus.INACTIVE]: 'Inactivo',
};

const sourceLabels: Record<ContactSource, string> = {
  [ContactSource.WEBSITE]: 'Sitio Web',
  [ContactSource.REFERRAL]: 'Referido',
  [ContactSource.SOCIAL_MEDIA]: 'Redes Sociales',
  [ContactSource.EMAIL]: 'Email',
  [ContactSource.PHONE]: 'Teléfono',
  [ContactSource.OTHER]: 'Otro',
};

export const ContactForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
      companyName: initialData?.companyName || '',
      status: initialData?.status || ContactStatus.LEAD,
      source: initialData?.source || ContactSource.WEBSITE,
      notes: initialData?.notes || '',
      companyId: initialData?.companyId || '',
    },
  });

  const companyId = watch('companyId');
  const status = watch('status');
  const source = watch('source');

  const handleFormSubmit = (values: ContactFormValues) => {
    onSubmit({
      ...values,
      position: values.position || null,
      companyName: values.companyName || null,
      notes: values.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nombre y Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            placeholder="Juan Pérez"
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@empresa.com"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Teléfono y Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="+57 300 123 4567"
            {...register('phone')}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
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

      {/* Cargo y Nombre de Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">
            Cargo <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="position"
            placeholder="Gerente de Ventas"
            {...register('position')}
            disabled={isSubmitting}
          />
          {errors.position && (
            <p className="text-sm text-red-500">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">
            Nombre de Empresa <span className="text-gray-500 text-xs">(Opcional)</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Empresa XYZ"
            {...register('companyName')}
            disabled={isSubmitting}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName.message}</p>
          )}
        </div>
      </div>

      {/* Estado y Fuente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as ContactStatus)}
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
          <Label htmlFor="source">Fuente</Label>
          <Select
            value={source}
            onValueChange={(value) => setValue('source', value as ContactSource)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona fuente" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sourceLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && (
            <p className="text-sm text-red-500">{errors.source.message}</p>
          )}
        </div>
      </div>

      {/* Notas - Ancho completo */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notas <span className="text-gray-500 text-xs">(Opcional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Notas adicionales sobre el contacto..."
          {...register('notes')}
          disabled={isSubmitting}
          rows={4}
        />
        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
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
            initialData ? 'Actualizar Contacto' : 'Crear Contacto'
          )}
        </Button>
      </div>
    </form>
  );
};
