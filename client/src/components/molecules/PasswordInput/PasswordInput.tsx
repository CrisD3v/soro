/**
 * PasswordInput component - Molecule
 * Input de contraseña con toggle de visibilidad
 */

'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { forwardRef, useState } from 'react';
import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error = false, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => setShowPassword((prev) => !prev);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-12', className)}
          aria-invalid={error}
          {...props}
        />
        <motion.button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
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
  }
);

PasswordInput.displayName = 'PasswordInput';
