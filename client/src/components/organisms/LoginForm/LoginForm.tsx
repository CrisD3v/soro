/**
 * LoginForm component - Organism
 * Formulario de inicio de sesión con validación
 */

'use client';

import { FormField } from '@/components/molecules/FormField/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/lib/queries/auth.queries';
import { loginSchema, type LoginFormData } from '@/lib/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, LogIn, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import type { LoginFormProps } from './LoginForm.types';

export const LoginForm = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchToReset,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
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

      {loginMutation.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400">
            {Array.isArray(loginMutation.error.message)
              ? loginMutation.error.message[0]
              : loginMutation.error.message}
          </p>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-sm">
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSwitchToReset}
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 p-0 h-auto"
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 dark:disabled:bg-purple-800"
        >
          {loginMutation.isPending ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </>
          )}
        </Button>
      </motion.div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSwitchToRegister}
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 p-0 h-auto font-medium"
        >
          Regístrate
        </Button>
      </div>
    </motion.form>
  );
};
