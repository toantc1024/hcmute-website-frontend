import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/api-client';
import type {
  TagSimpleView,
  TagAuditView,
  CreateTagRequest,
  UpdateTagRequest,
  KeysetPaginationResponse,
} from '../types';

export interface TagsQueryParams {
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

type TagsApiResponse = ApiResponse<KeysetPaginationResponse<TagSimpleView> | TagSimpleView[]>;

export const tagsApi = {
  getTags: async (
    params: TagsQueryParams = {}
  ): Promise<TagSimpleView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/tags?${queryString}` : '/api/v1/tags';
    
    const response = await apiClient.get<TagsApiResponse>(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch tags');
    }
    
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },

  getTagById: async (tagId: string): Promise<TagSimpleView> => {
    const response = await apiClient.get<ApiResponse<TagSimpleView>>(
      `/api/v1/tags/${tagId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch tag');
    }
    
    return response.data.data;
  },

  createTag: async (name: string): Promise<TagAuditView> => {
    const data: CreateTagRequest = {
      name,
      slug: generateSlug(name),
    };
    
    const response = await apiClient.post<ApiResponse<TagAuditView>>(
      '/api/v1/admin/tags',
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to create tag');
    }
    
    const tagData = response.data.data;
    if (!tagData || !tagData.id) {
      throw new Error('Invalid response: tag data is missing');
    }
    
    return tagData;
  },

  updateTag: async (tagId: string, data: UpdateTagRequest): Promise<TagAuditView> => {
    const response = await apiClient.patch<ApiResponse<TagAuditView>>(
      `/api/v1/admin/tags/${tagId}`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to update tag');
    }
    
    return response.data.data;
  },

  deleteTag: async (tagId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/tags/${tagId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to delete tag');
    }
  },

  getAdminTags: async (
    params: TagsQueryParams = {}
  ): Promise<TagAuditView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/admin/tags?${queryString}` : '/api/v1/admin/tags';
    
    const response = await apiClient.get<ApiResponse<KeysetPaginationResponse<TagAuditView> | TagAuditView[]>>(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch tags');
    }
    
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },
};
