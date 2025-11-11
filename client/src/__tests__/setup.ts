import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => { },
  }),
});

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});
