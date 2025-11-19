/**
 * Event Queries
 * React Query hooks para gestión de eventos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventApi } from '../api/event.api';
import type { CreateEventDto, EventFilters } from '../api/event.types';

// Query Keys Factory
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

/**
 * Hook para obtener todos los eventos
 */
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventApi.getAll(filters),
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
};

/**
 * Hook para obtener un evento por ID
 */
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un evento
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Evento creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear evento');
    },
  });
};

/**
 * Hook para procesar un evento
 */
export const useProcessEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventApi.process(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      toast.success('Evento procesado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al procesar evento');
    },
  });
};
