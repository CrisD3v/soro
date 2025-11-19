'use client';

/**
 * ContactSelect Component
 * Selector dinámico de contactos con carga desde API
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContacts } from '@/lib/queries/contact.queries';
import type { ContactSelectProps } from './ContactSelect.types';

export const ContactSelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Selecciona un contacto',
  companyId,
}: ContactSelectProps) => {
  const { data: contacts, isLoading } = useContacts(companyId ? { companyId } : undefined);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {contacts?.map((contact) => (
          <SelectItem key={contact.id} value={contact.id}>
            {contact.name} - {contact.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
