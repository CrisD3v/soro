/**
 * PasswordInput component - Molecule
 * Input de contraseña con toggle de visibilidad
 */

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = ({
  error = false,
  className = '',
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        className={`w-full px-4 py-2 pr-12 rounded-lg border ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors ${className}`}
        {...props}
      />
      <motion.button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};
