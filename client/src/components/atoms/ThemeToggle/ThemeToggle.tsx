/**
 * ThemeToggle component - Atom
 * Botón para cambiar entre modo claro y oscuro
 */

'use client';

import { useTheme } from '@/hooks/useTheme/useTheme';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import type { ThemeToggleProps } from './ThemeToggle.types';

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-purple-600" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -180,
          scale: theme === 'dark' ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-purple-400" />
      </motion.div>
      <div className="w-5 h-5 opacity-0" />
    </motion.button>
  );
};
