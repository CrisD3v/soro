'use client';

/**
 * CompanySwitcher - Selector de empresa para usuarios OWNER
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useCompanies } from '@/lib/queries/company.queries';
import { Building2 } from 'lucide-react';

export function CompanySwitcher() {
  const { isOwner, currentCompanyId, setCurrentCompanyId, user } = useAuth();
  const { data: companies, isLoading } = useCompanies();

  // Solo mostrar para usuarios OWNER
  if (!isOwner) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
        <Building2 className="h-4 w-4" />
        <span>Loading companies...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Building2 className="h-4 w-4 text-purple-400" />
      <Select
        value={currentCompanyId || 'all'}
        onValueChange={(value) => setCurrentCompanyId(value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[200px] h-8 text-sm">
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies?.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
