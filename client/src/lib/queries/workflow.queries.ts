/**
 * Workflow Queries
 * React Query hooks para gestión de workflows
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowApi } from '../api/workflow.api';
import type { CreateWorkflowDto, UpdateWorkflowDto, WorkflowFilters } from '../api/workflow.types';

// Query Keys Factory
export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters?: WorkflowFilters) => [...workflowKeys.lists(), filters] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
};

/**
 * Hook para obtener todos los workflows
 */
export const useWorkflows = (filters?: WorkflowFilters) => {
  return useQuery({
    queryKey: workflowKeys.list(filters),
    queryFn: () => workflowApi.getAll(filters),
  });
};

/**
 * Hook para obtener un workflow por ID
 */
export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => workflowApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowDto) => workflowApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      toast.success('Workflow creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear workflow');
    },
  });
};

/**
 * Hook para actualizar un workflow
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowDto }) =>
      workflowApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      toast.success('Workflow actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar workflow');
    },
  });
};

/**
 * Hook para eliminar un workflow
 */
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      toast.success('Workflow eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar workflow');
    },
  });
};
