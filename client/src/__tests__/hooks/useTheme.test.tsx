/**
 * Tests para el hook useTheme
 */

import { useTheme } from '@/hooks/useTheme/useTheme';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('useTheme', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Limpiar clases del documento
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('debe iniciar con tema light por defecto', () => {
    const { result } = renderHook(() => useTheme());

    // Esperar a que se monte
    act(() => { });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('debe cambiar el tema a dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('debe alternar entre light y dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('debe persistir el tema en localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorage.getItem('soro_theme')).toBe('dark');
  });

  it('debe aplicar la clase "dark" al documento', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('debe remover la clase "dark" al cambiar a light', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
