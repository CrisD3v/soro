/**
 * LoginForm component - Organism
 * Formulario de inicio de sesión con validación
 */

'use client';

import { FormField } from '@/components/molecules/FormField/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
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
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={`w-full pl-11 pr-4 py-2 rounded-lg border ${errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors`}
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
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
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
        <button
          type="button"
          onClick={onSwitchToReset}
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <motion.button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 dark:disabled:bg-purple-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
      </motion.button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
        >
          Regístrate
        </button>
      </div>
    </motion.form>
  );
};
