/**
 * Contact Queries
 * TanStack Query hooks para gestión de contactos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../api/contact.api';
import type { ContactFilters, CreateContactDto, UpdateContactDto } from '../api/contact.types';

/**
 * Query key factory para contactos
 */
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters?: ContactFilters) => [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de contactos
 */
export const useContacts = (filters?: ContactFilters) => {
  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: () => contactApi.getAll(filters),
  });
};

/**
 * Hook para obtener un contacto por ID
 */
export const useContact = (id: string) => {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un contacto
 */
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDto) => contactApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un contacto
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactDto }) =>
      contactApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un contacto
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
};
