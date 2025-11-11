/**
 * Hook para detectar la posición del scroll
 * Útil para cambiar estilos del navbar al hacer scroll
 */

'use client';

import { useEffect, useState } from 'react';
import type { UseScrollPositionReturn } from './useScrollPosition.types';

export const useScrollPosition = (threshold = 50): UseScrollPositionReturn => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > threshold);
    };

    // Llamar una vez al montar
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { scrollY, isScrolled };
};
