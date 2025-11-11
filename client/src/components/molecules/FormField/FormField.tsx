/**
 * FormField component - Molecule
 * Wrapper para inputs con label y mensaje de error
 */

'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { FormFieldProps } from './FormField.types';

export const FormField = ({
  label,
  error,
  required = false,
  children,
  htmlFor,
  className = '',
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-purple-500 ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
