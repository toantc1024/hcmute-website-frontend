import { publicApiClient } from "../axios-instance";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "../types";

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

export const categoriesApi = {
  getAllCategories: async (
    params?: CategoriesQueryParams
  ): Promise<PaginatedResponse<CategoryView>> => {
    const response = await publicApiClient.get<
      ApiResponse<PaginatedResponse<CategoryView>>
    >("/api/v1/categories", { params });
    return response.data.data;
  },

  getCategoryById: async (categoryId: string): Promise<CategoryView> => {
    const response = await publicApiClient.get<ApiResponse<CategoryView>>(
      `/api/v1/categories/${categoryId}`
    );
    return response.data.data;
  },
};
