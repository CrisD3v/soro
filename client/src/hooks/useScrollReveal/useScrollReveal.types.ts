/**
 * Types para el hook useScrollReveal
 */

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}
