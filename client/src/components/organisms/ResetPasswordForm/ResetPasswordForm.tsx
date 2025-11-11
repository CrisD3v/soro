/**
 * ResetPasswordForm component - Organism
 * Formulario para solicitar cambio de contraseña
 */

'use client';

import { FormField } from '@/components/molecules/FormField/FormField';
import { useResetPassword } from '@/lib/queries/auth.queries';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import type { ResetPasswordFormProps } from './ResetPasswordForm.types';

export const ResetPasswordForm = ({
  onSuccess,
  onSwitchToLogin,
}: ResetPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetMutation = useResetPassword({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetMutation.mutate(data);
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
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ¿Olvidaste tu contraseña?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu email y te enviaremos instrucciones para recuperarla
        </p>
      </div>

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

      {resetMutation.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400">
            {Array.isArray(resetMutation.error.message)
              ? resetMutation.error.message[0]
              : resetMutation.error.message}
          </p>
        </motion.div>
      )}

      {resetMutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <p className="text-sm text-green-600 dark:text-green-400">
            ¡Correo enviado! Revisa tu bandeja de entrada
          </p>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={resetMutation.isPending || resetMutation.isSuccess}
        className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 dark:disabled:bg-purple-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {resetMutation.isPending ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Instrucciones
          </>
        )}
      </motion.button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio de sesión
      </button>
    </motion.form>
  );
};
