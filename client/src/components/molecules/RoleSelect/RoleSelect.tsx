'use client';

/**
 * RoleSelect Component
 * Selector de roles que carga desde el backend
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoles } from '@/lib/queries/role.queries';

interface RoleSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const RoleSelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Selecciona un rol',
}: RoleSelectProps) => {
  const { data: roles = [], isLoading } = useRoles();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? 'Cargando roles...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roles.length > 0 ? (
          roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              <div className="flex flex-col">
                <span className="font-medium capitalize">{role.name}</span>
                <span className="text-xs text-gray-500">
                  {role.permissionCount} {role.permissionCount === 1 ? 'permiso' : 'permisos'}
                </span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">
            {isLoading ? 'Cargando...' : 'No hay roles disponibles'}
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
