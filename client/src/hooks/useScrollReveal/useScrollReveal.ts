/**
 * Hook para detectar cuando un elemento es visible en el viewport
 * Útil para animaciones de scroll reveal
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { UseScrollRevealOptions, UseScrollRevealReturn } from './useScrollReveal.types';

export const useScrollReveal = (
  options: UseScrollRevealOptions = {}
): UseScrollRevealReturn => {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez visible, dejamos de observar
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
