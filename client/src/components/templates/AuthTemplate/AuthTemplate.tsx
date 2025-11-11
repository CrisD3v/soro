/**
 * AuthTemplate component - Template
 * Template principal para vistas de autenticación con transiciones
 * Implementa Compound Component Pattern
 */

'use client';

import { Logo } from '@/components/atoms/Logo/Logo';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { LoginForm } from '@/components/organisms/LoginForm/LoginForm';
import { RegisterForm } from '@/components/organisms/RegisterForm/RegisterForm';
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm/ResetPasswordForm';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { AuthTemplateProps, AuthView } from './AuthTemplate.types';

export const AuthTemplate = ({
  initialView = 'login',
  onAuthSuccess,
}: AuthTemplateProps) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  const viewTitles: Record<AuthView, string> = {
    login: 'Bienvenido de nuevo',
    register: 'Crear cuenta',
    reset: 'Recuperar contraseña',
  };

  const viewSubtitles: Record<AuthView, string> = {
    login: 'Ingresa tus credenciales para continuar',
    register: 'Completa el formulario para registrarte',
    reset: 'Te ayudaremos a recuperar tu acceso',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-purple-100 dark:border-purple-900/50">
          <div className="flex flex-col items-center space-y-4">
            <Logo size="md" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-center space-y-2"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {viewTitles[currentView]}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {viewSubtitles[currentView]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {currentView === 'login' && (
              <LoginForm
                key="login"
                onSuccess={onAuthSuccess}
                onSwitchToRegister={() => setCurrentView('register')}
                onSwitchToReset={() => setCurrentView('reset')}
              />
            )}
            {currentView === 'register' && (
              <RegisterForm
                key="register"
                onSuccess={() => setCurrentView('login')}
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}
            {currentView === 'reset' && (
              <ResetPasswordForm
                key="reset"
                onSuccess={() => setCurrentView('login')}
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}
          </AnimatePresence>
        </div>

        <motion.p
          className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © 2024 SORO. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
};
