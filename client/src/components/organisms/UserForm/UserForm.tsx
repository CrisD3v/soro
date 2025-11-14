'use client';

/**
 * UserForm Component
 * Formulario para crear/editar usuarios con validación
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { UserFormProps } from './UserForm.types';

// Schema de validación con Zod
const userFormSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúsculas, minúsculas y números'
    ),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  documentNumber: z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  documentType: z.enum(['CC', 'CE', 'TI']),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres')
    .regex(/^\+?[0-9]+$/, 'El teléfono solo puede contener números y +'),
  companyId: z
    .string()
    .min(1, 'La empresa es requerida')
    .uuid('ID de empresa inválido'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export const UserForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  onCancel,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: initialData?.email || '',
      password: initialData?.password || '',
      name: initialData?.name || '',
      lastName: initialData?.lastName || '',
      documentNumber: initialData?.documentNumber || '',
      documentType: initialData?.documentType || 'CC',
      phone: initialData?.phone || '',
      companyId: initialData?.companyId || '',
    },
  });

  const documentType = watch('documentType');

  const handleFormSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Email y Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mínimo 8 caracteres, mayúsculas, minúsculas y números
          </p>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Juan"
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Pérez"
            {...register('lastName')}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Documento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento</Label>
          <Select
            value={documentType}
            onValueChange={(value) => setValue('documentType', value as 'CC' | 'CE' | 'TI')}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona">
                {documentType === 'CC' && 'CC'}
                {documentType === 'CE' && 'CE'}
                {documentType === 'TI' && 'TI'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">CC</span>
                  <span className="text-sm text-gray-500 ml-2">Cédula de Ciudadanía</span>
                </div>
              </SelectItem>
              <SelectItem value="CE">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">CE</span>
                  <span className="text-sm text-gray-500 ml-2">Cédula de Extranjería</span>
                </div>
              </SelectItem>
              <SelectItem value="TI">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">TI</span>
                  <span className="text-sm text-gray-500 ml-2">Tarjeta de Identidad</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.documentType && (
            <p className="text-sm text-red-500">{errors.documentType.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="documentNumber">Número de Documento</Label>
          <Input
            id="documentNumber"
            placeholder="1234567890"
            {...register('documentNumber')}
            disabled={isSubmitting}
          />
          {errors.documentNumber && (
            <p className="text-sm text-red-500">{errors.documentNumber.message}</p>
          )}
        </div>
      </div>

      {/* Teléfono y Empresa */}
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
          <Label htmlFor="companyId">Empresa</Label>
          <CompanySelect
            value={watch('companyId')}
            onValueChange={(value) => setValue('companyId', value)}
            disabled={isSubmitting}
            placeholder="Selecciona una empresa"
          />
          {errors.companyId && (
            <p className="text-sm text-red-500">{errors.companyId.message}</p>
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
            'Crear Usuario'
          )}
        </Button>
      </div>
    </form>
  );
};
