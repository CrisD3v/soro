'use client';

/**
 * SettingForm Component
 * Formulario para crear/editar configuraciones del sistema
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
import type { CreateSettingDto } from '@/lib/api/setting.types';
import { SETTING_CATEGORY_LABELS, SettingCategory } from '@/lib/api/setting.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { SettingFormProps } from './SettingForm.types';

// Schema de validación
const settingSchema = z.object({
  key: z.string().min(2, 'La clave debe tener al menos 2 caracteres').max(100),
  value: z.string().min(1, 'El valor es requerido'),
  description: z.string().optional(),
  category: z.nativeEnum(SettingCategory),
  isPublic: z.boolean(),
  companyId: z.string().uuid('Debe seleccionar una empresa válida'),
});

type SettingFormData = z.infer<typeof settingSchema>;

export const SettingForm = ({ setting, onSubmit, isLoading = false }: SettingFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: setting
      ? {
        key: setting.key,
        value: setting.value,
        description: setting.description || '',
        category: setting.category,
        isPublic: setting.isPublic,
        companyId: setting.companyId,
      }
      : {
        isPublic: false,
      },
  });

  const category = watch('category');
  const companyId = watch('companyId');
  const isPublic = watch('isPublic');

  const handleFormSubmit = (data: SettingFormData) => {
    onSubmit(data as CreateSettingDto);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Fila 1: Clave y Categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Clave de Configuración</Label>
          <Input
            id="key"
            {...register('key')}
            placeholder="ej: max_file_size"
            disabled={isLoading || !!setting}
          />
          {errors.key && (
            <p className="text-sm text-red-400">{errors.key.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue('category', value as SettingCategory)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SettingCategory).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {SETTING_CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-400">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Fila 2: Valor */}
      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Input
          id="value"
          {...register('value')}
          placeholder="Valor de la configuración"
          disabled={isLoading}
        />
        {errors.value && (
          <p className="text-sm text-red-400">{errors.value.message}</p>
        )}
      </div>

      {/* Fila 3: Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción (Opcional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descripción de la configuración"
          rows={3}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Fila 4: Empresa y Visibilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyId">Empresa</Label>
          <CompanySelect
            value={companyId}
            onValueChange={(value) => setValue('companyId', value)}
            disabled={isLoading || !!setting}
          />
          {errors.companyId && (
            <p className="text-sm text-red-400">{errors.companyId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isPublic">Visibilidad</Label>
          <Select
            value={isPublic ? 'true' : 'false'}
            onValueChange={(value) => setValue('isPublic', value === 'true')}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Privada</SelectItem>
              <SelectItem value="true">Pública</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-white/60">
            Las configuraciones públicas son visibles para todos los usuarios de la empresa
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
          {isLoading ? 'Guardando...' : setting ? 'Actualizar' : 'Crear'} Configuración
        </Button>
      </div>
    </form>
  );
};
