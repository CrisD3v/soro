/**
 * Company Queries
 * TanStack Query hooks para gestión de empresas
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/company.api';
import type { CompanyFilters, CreateCompanyDto, UpdateCompanyDto } from '../api/company.types';

/**
 * Query key factory para empresas
 */
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters?: CompanyFilters) => [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  hierarchy: (id: string) => [...companyKeys.all, 'hierarchy', id] as const,
};

/**
 * Hook para obtener lista de empresas
 */
export const useCompanies = (filters?: CompanyFilters) => {
  return useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () => companyApi.getAll(filters),
  });
};

/**
 * Hook para obtener una empresa por ID
 */
export const useCompany = (id: string, includeDeleted?: boolean) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companyApi.getById(id, includeDeleted),
    enabled: !!id,
  });
};

/**
 * Hook para crear una empresa
 */
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyDto) => companyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar una empresa
 */
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyDto }) =>
      companyApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar una empresa
 */
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

/**
 * Hook para restaurar una empresa
 */
export const useRestoreCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

/**
 * Hook para obtener jerarquía de una empresa
 */
export const useCompanyHierarchy = (id: string) => {
  return useQuery({
    queryKey: companyKeys.hierarchy(id),
    queryFn: () => companyApi.getHierarchy(id),
    enabled: !!id,
  });
};
