/**
 * Document Queries
 * TanStack Query hooks para gestión de documentos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../api/document.api';
import type { CreateDocumentDto, DocumentFilters, UpdateDocumentDto } from '../api/document.types';

/**
 * Query key factory para documentos
 */
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters?: DocumentFilters) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de documentos
 */
export const useDocuments = (filters?: DocumentFilters) => {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => documentApi.getAll(filters),
  });
};

/**
 * Hook para obtener un documento por ID
 */
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un documento
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentDto) => documentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un documento
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentDto }) =>
      documentApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un documento
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};
