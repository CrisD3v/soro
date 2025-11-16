/**
 * Project Queries
 * TanStack Query hooks para gestión de proyectos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project.api';
import type { CreateProjectDto, ProjectFilters, UpdateProjectDto } from '../api/project.types';

/**
 * Query key factory para proyectos
 */
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de proyectos
 */
export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectApi.getAll(filters),
  });
};

/**
 * Hook para obtener un proyecto por ID
 */
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un proyecto
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un proyecto
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un proyecto
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
