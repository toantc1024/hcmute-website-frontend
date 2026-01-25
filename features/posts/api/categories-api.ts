import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/api-client';
import type {
  CategorySimpleView,
  CategoryAuditView,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  KeysetPaginationResponse,
} from '../types';

export interface CategoriesQueryParams {
  cursor?: string;
  size?: number;
  sort?: string;
  search?: string;
}

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

type CategoriesApiResponse = ApiResponse<KeysetPaginationResponse<CategorySimpleView> | CategorySimpleView[]>;

export const categoriesApi = {
  getCategories: async (
    params: CategoriesQueryParams = {}
  ): Promise<CategorySimpleView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/categories?${queryString}` : '/api/v1/categories';
    
    const response = await apiClient.get<CategoriesApiResponse>(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
    
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },

  getCategoryById: async (categoryId: string): Promise<CategorySimpleView> => {
    const response = await apiClient.get<ApiResponse<CategorySimpleView>>(
      `/api/v1/categories/${categoryId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch category');
    }
    
    return response.data.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<CategoryAuditView> => {
    const response = await apiClient.post<ApiResponse<CategoryAuditView>>(
      '/api/v1/admin/categories',
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to create category');
    }
    
    return response.data.data;
  },

  updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<CategoryAuditView> => {
    const response = await apiClient.patch<ApiResponse<CategoryAuditView>>(
      `/api/v1/admin/categories/${categoryId}`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to update category');
    }
    
    return response.data.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/categories/${categoryId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to delete category');
    }
  },

  getAdminCategories: async (
    params: CategoriesQueryParams = {}
  ): Promise<CategoryAuditView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/admin/categories?${queryString}` : '/api/v1/admin/categories';
    
    const response = await apiClient.get<ApiResponse<KeysetPaginationResponse<CategoryAuditView> | CategoryAuditView[]>>(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
    
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },
};
