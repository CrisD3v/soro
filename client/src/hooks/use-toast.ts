/**
 * useToast Hook
 * Hook para mostrar notificaciones usando sonner
 */

import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast.success(title, {
        description,
      });
    }
  };

  return { toast };
};

// Re-export sonner toast para uso directo si es necesario
export { toast as sonnerToast } from 'sonner';
