/**
 * RegisterForm component - Organism
 * Formulario de registro con validación completa
 */

'use client';

import { FormField } from '@/components/molecules/FormField/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRegister } from '@/lib/queries/auth.queries';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  FileText,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import type { RegisterFormProps } from './RegisterForm.types';

export const RegisterForm = ({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nombre"
          error={errors.name?.message}
          required
          htmlFor="name"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              id="name"
              type="text"
              placeholder="Juan"
              className="pl-11"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </div>
        </FormField>

        <FormField
          label="Apellido"
          error={errors.lastName?.message}
          required
          htmlFor="lastName"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              id="lastName"
              type="text"
              placeholder="Pérez"
              className="pl-11"
              aria-invalid={!!errors.lastName}
              {...register('lastName')}
            />
          </div>
        </FormField>
      </div>

      <FormField
        label="Email"
        error={errors.email?.message}
        required
        htmlFor="email"
      >
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="pl-11"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
      </FormField>

      <FormField
        label="Contraseña"
        error={errors.password?.message}
        required
        htmlFor="password"
      >
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <PasswordInput
            id="password"
            placeholder="••••••••"
            error={!!errors.password}
            className="pl-11"
            {...register('password')}
          />
        </div>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Tipo de Documento"
          error={errors.documentType?.message}
          required
          htmlFor="documentType"
        >
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Select
              onValueChange={(value) =>
                setValue('documentType', value as 'CC' | 'CE' | 'TI')
              }
            >
              <SelectTrigger
                className="pl-11 w-full"
                aria-invalid={!!errors.documentType}
              >
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormField>

        <FormField
          label="Número de Documento"
          error={errors.documentNumber?.message}
          required
          htmlFor="documentNumber"
        >
          <Input
            id="documentNumber"
            type="text"
            placeholder="1234567890"
            aria-invalid={!!errors.documentNumber}
            {...register('documentNumber')}
          />
        </FormField>
      </div>

      <FormField
        label="Teléfono"
        error={errors.phone?.message}
        required
        htmlFor="phone"
      >
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            id="phone"
            type="tel"
            placeholder="+573001234567"
            className="pl-11"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
        </div>
      </FormField>

      <FormField
        label="ID de Empresa"
        error={errors.companyId?.message}
        required
        htmlFor="companyId"
      >
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            id="companyId"
            type="text"
            placeholder="UUID de la empresa"
            className="pl-11"
            aria-invalid={!!errors.companyId}
            {...register('companyId')}
          />
        </div>
      </FormField>

      {registerMutation.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400">
            {Array.isArray(registerMutation.error.message)
              ? registerMutation.error.message[0]
              : registerMutation.error.message}
          </p>
        </motion.div>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 dark:disabled:bg-purple-800"
        >
          {registerMutation.isPending ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Registrarse
            </>
          )}
        </Button>
      </motion.div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSwitchToLogin}
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 p-0 h-auto font-medium"
        >
          Inicia sesión
        </Button>
      </div>
    </motion.form>
  );
};
