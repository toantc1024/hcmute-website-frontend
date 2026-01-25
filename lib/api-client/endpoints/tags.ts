import { publicApiClient } from "../axios-instance";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "../types";

export interface TagView {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagsQueryParams extends PaginationParams {
  name?: string;
  slug?: string;
}

export const tagsApi = {
  getAllTags: async (
    params?: TagsQueryParams
  ): Promise<PaginatedResponse<TagView>> => {
    const response = await publicApiClient.get<
      ApiResponse<PaginatedResponse<TagView>>
    >("/api/v1/tags", { params });
    return response.data.data;
  },

  getTagById: async (tagId: string): Promise<TagView> => {
    const response = await publicApiClient.get<ApiResponse<TagView>>(
      `/api/v1/tags/${tagId}`
    );
    return response.data.data;
  },
};
