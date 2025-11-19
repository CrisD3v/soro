/**
 * useCurrentCompany - Hook para obtener la empresa actual del usuario
 */

import { useCompany } from '@/lib/queries/company.queries';
import { useAuth } from './useAuth';

export function useCurrentCompany() {
  const { user, currentCompanyId } = useAuth();

  // Usar la empresa seleccionada (para OWNER) o la empresa del usuario
  const companyId = currentCompanyId || user?.companyId;

  const { data: company, isLoading, error } = useCompany(companyId || '', {
    enabled: !!companyId,
  });

  return {
    company,
    companyName: company?.name || 'SORO',
    isLoading,
    error,
  };
}
