import { apiClient } from './client';
import { Company, CompanyHierarchy, CreateCompanyDto, UpdateCompanyDto } from './company.types';

export const companyApi = {
  /**
   * Get all companies
   */
  getCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>('/companies');
    return response.data;
  },

  /**
   * Get company by ID
   */
  getCompanyById: async (id: string): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${id}`);
    return response.data;
  },

  /**
   * Create new company
   */
  createCompany: async (data: CreateCompanyDto): Promise<Company> => {
    const response = await apiClient.post<Company>('/companies', data);
    return response.data;
  },

  /**
   * Update company
   */
  updateCompany: async (id: string, data: UpdateCompanyDto): Promise<Company> => {
    const response = await apiClient.patch<Company>(`/companies/${id}`, data);
    return response.data;
  },

  /**
   * Delete company (soft delete)
   */
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/companies/${id}`);
  },

  /**
   * Restore deleted company
   */
  restoreCompany: async (id: string): Promise<Company> => {
    const response = await apiClient.post<Company>(`/companies/${id}/restore`);
    return response.data;
  },

  /**
   * Get company hierarchy
   */
  getCompanyHierarchy: async (id: string): Promise<CompanyHierarchy> => {
    const response = await apiClient.get<CompanyHierarchy>(`/companies/${id}/hierarchy`);
    return response.data;
  },
};
