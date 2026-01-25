import { publicApiClient } from "../axios-instance";
import type { ApiResponse } from "../types";

export interface PostAuthor {
  id: string;
  userId: string;
  userName: string;
  displayName: string;
  avatarUrl?: string;
  authorType: "OWNER" | "CONTRIBUTOR";
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

export interface PostMedia {
  id: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  displayOrder: number;
}

export interface PostDetailView {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  authors: PostAuthor[];
  categories: PostCategory[];
  tags: PostTag[];
  media: PostMedia[];
}

export interface PostAuditView {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  authors: PostAuthor[];
  categories: PostCategory[];
  tags: PostTag[];
}

export interface KeysetPaginationResponse<T> {
  content: T[];
  hasNext: boolean;
  cursor?: string;
  totalElements?: number;
}

export interface PostsQueryParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
}

export const postsApi = {
  getPublishedPosts: async (
    params?: PostsQueryParams
  ): Promise<KeysetPaginationResponse<PostAuditView>> => {
    const response = await publicApiClient.get<
      ApiResponse<KeysetPaginationResponse<PostAuditView>>
    >("/api/v1/posts", { params });
    return response.data.data;
  },

  getPostById: async (postId: string): Promise<PostDetailView> => {
    const response = await publicApiClient.get<ApiResponse<PostDetailView>>(
      `/api/v1/posts/${postId}`
    );
    return response.data.data;
  },

  getPostBySlug: async (slug: string): Promise<PostDetailView> => {
    const response = await publicApiClient.get<ApiResponse<PostDetailView>>(
      `/api/v1/posts/slug/${slug}`
    );
    return response.data.data;
  },
};
