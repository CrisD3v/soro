'use client';

/**
 * CompanySelect Component
 * Selector de empresas que carga desde el backend
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCompanies } from '@/lib/queries/company.queries';

interface CompanySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const CompanySelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Selecciona una empresa',
}: CompanySelectProps) => {
  const { data: companies = [], isLoading } = useCompanies();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? 'Cargando empresas...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {companies.length > 0 ? (
          companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex flex-col">
                <span className="font-medium">{company.name}</span>
                <span className="text-xs text-gray-500">{company.nit}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">
            {isLoading ? 'Cargando...' : 'No hay empresas disponibles'}
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
