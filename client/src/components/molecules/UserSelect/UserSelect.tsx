'use client';

/**
 * UserSelect Component
 * Selector dinámico de usuarios con carga desde API
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUsers } from '@/lib/queries/user.queries';
import type { UserSelectProps } from './UserSelect.types';

export const UserSelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Selecciona un usuario',
  companyId,
}: UserSelectProps) => {
  const { data: users, isLoading } = useUsers(companyId ? { companyId } : undefined);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {users?.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
