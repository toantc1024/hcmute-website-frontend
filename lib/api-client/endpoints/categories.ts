import { apiClient, publicApiClient } from "../axios-instance";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types";

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesQueryParams extends PaginationParams {
  name?: string;
  slug?: string;
  parentId?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
}

export const categoriesApi = {
  getAllCategories: async (
    params?: CategoriesQueryParams,
  ): Promise<PaginatedResponse<CategoryView>> => {
    const response = await publicApiClient.get<
      ApiResponse<PaginatedResponse<CategoryView>>
    >("/api/v1/categories", { params });
    return response.data.data;
  },

  getCategoryById: async (categoryId: string): Promise<CategoryView> => {
    const response = await publicApiClient.get<ApiResponse<CategoryView>>(
      `/api/v1/categories/${categoryId}`,
    );
    return response.data.data;
  },

  // ---- Admin CRUD operations ----

  createCategory: async (
    data: CreateCategoryRequest,
  ): Promise<CategoryView> => {
    const response = await apiClient.post<ApiResponse<CategoryView>>(
      "/api/v1/admin/categories",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to create category");
    }

    return response.data.data;
  },

  updateCategory: async (
    categoryId: string,
    data: UpdateCategoryRequest,
  ): Promise<CategoryView> => {
    const response = await apiClient.put<ApiResponse<CategoryView>>(
      `/api/v1/admin/categories/${categoryId}`,
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update category");
    }

    return response.data.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/categories/${categoryId}`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to delete category");
    }
  },
};
