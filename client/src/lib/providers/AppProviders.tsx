'use client';

/**
 * AppProviders - Wrapper de todos los providers del cliente
 */

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </AuthProvider>
    </QueryProvider>
  );
}
