/**
 * Hook para manejar el tema (dark/light mode)
 * Persiste la preferencia en localStorage y aplica la clase al documento
 */

'use client';

import type { Theme } from '@/lib/types/common.types';
import { useEffect, useState } from 'react';
import type { UseThemeReturn } from './useTheme.types';

const STORAGE_KEY = 'soro_theme';
const DARK_CLASS = 'dark';

/**
 * Obtiene el tema inicial desde localStorage o preferencia del sistema
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) return stored;

  // Detectar preferencia del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

/**
 * Hook para manejar el tema de la aplicación
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Inicializar tema después del montaje
  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add(DARK_CLASS);
    } else {
      root.classList.remove(DARK_CLASS);
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
