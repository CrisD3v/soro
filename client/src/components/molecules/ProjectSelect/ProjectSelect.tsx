'use client';

/**
 * ProjectSelect Component
 * Selector dinámico de proyectos con carga desde API
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjects } from '@/lib/queries/project.queries';
import type { ProjectSelectProps } from './ProjectSelect.types';

export const ProjectSelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Selecciona un proyecto',
  companyId,
}: ProjectSelectProps) => {
  const { data: projects, isLoading } = useProjects(companyId ? { companyId } : undefined);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects?.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
