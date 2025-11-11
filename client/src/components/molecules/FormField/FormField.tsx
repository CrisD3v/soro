/**
 * FormField component - Molecule
 * Wrapper para inputs con label y mensaje de error
 */

'use client';

import { Label } from '@/components/ui/label';
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
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-purple-500 ml-1">*</span>}
      </Label>
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
