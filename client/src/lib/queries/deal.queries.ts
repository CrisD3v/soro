/**
 * Deal Queries
 * TanStack Query hooks para gestión de deals
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dealApi } from '../api/deal.api';
import type { CreateDealDto, DealFilters, UpdateDealDto } from '../api/deal.types';

/**
 * Query key factory para deals
 */
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters?: DealFilters) => [...dealKeys.lists(), filters] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de deals
 */
export const useDeals = (filters?: DealFilters) => {
  return useQuery({
    queryKey: dealKeys.list(filters),
    queryFn: () => dealApi.getAll(filters),
  });
};

/**
 * Hook para obtener un deal por ID
 */
export const useDeal = (id: string) => {
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: () => dealApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un deal
 */
export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDealDto) => dealApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar un deal
 */
export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealDto }) =>
      dealApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un deal
 */
export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });
};
