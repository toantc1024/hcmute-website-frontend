import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/api-client';
import type {
  PostAuditView,
  PostDetailView,
  LockDto,
  PostReviewSessionAuditView,
  PostReviewSessionDetailView,
  PostHistoryAuditView,
  PostHistoryDetailView,
  CreatePostRequest,
  UpdatePostRequest,
  SubmitPostRequest,
  AssignReviewersRequest,
  AssignContributorsRequest,
  ApprovePostRequest,
  RejectPostRequest,
  ClonePostInternalRequest,
  CloneCrossTenantRequest,
  PostsQueryParams,
  KeysetPaginationResponse,
  KeysetPaginationParams,
  PostPromotionAuditView,
  ApprovePostPromotionRequest,
  RejectPostPromotionRequest,
} from '../types';

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export const postsApi = {
  getPosts: async (
    params: PostsQueryParams = {}
  ): Promise<KeysetPaginationResponse<PostAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/admin/posts?${queryString}` : '/api/v1/admin/posts';
    
    const response = await apiClient.get<ApiResponse<KeysetPaginationResponse<PostAuditView>>>(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch posts');
    }
    
    return response.data.data;
  },

  getPostById: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.get<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch post');
    }
    
    return response.data.data;
  },

  createPost: async (data: CreatePostRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      '/api/v1/admin/posts',
      data
    );
    
    if (!response.data.result) {
      const errorData = response.data as unknown as { data?: Array<{ field: string; message: string }> };
      if (errorData.data && Array.isArray(errorData.data)) {
        const fieldErrors = errorData.data.map(e => `${e.field}: ${e.message}`).join(', ');
        throw new Error(fieldErrors || response.data.message || 'Failed to create post');
      }
      throw new Error(response.data.message || 'Failed to create post');
    }
    
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    
    return response.data.data;
  },

  updatePost: async (postId: string, data: UpdatePostRequest): Promise<PostDetailView> => {
    const response = await apiClient.put<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}`,
      data
    );
    
    if (!response.data.result) {
      const errorData = response.data as unknown as { data?: Array<{ field: string; message: string }> };
      if (errorData.data && Array.isArray(errorData.data)) {
        const fieldErrors = errorData.data.map(e => `${e.field}: ${e.message}`).join(', ');
        throw new Error(fieldErrors || response.data.message || 'Failed to update post');
      }
      throw new Error(response.data.message || 'Failed to update post');
    }
    
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    
    return response.data.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/${postId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to delete post');
    }
  },

  acquireLock: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.post<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to acquire lock');
    }
    
    return response.data.data;
  },

  renewLock: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.put<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to renew lock');
    }
    
    return response.data.data;
  },

  releaseLock: async (postId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/${postId}/lock`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to release lock');
    }
  },

  getLockStatus: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.get<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to get lock status');
    }
    
    return response.data.data;
  },

  submitPost: async (postId: string, data: SubmitPostRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/submit`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to submit post');
    }
    
    return response.data.data;
  },

  cancelSubmission: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/cancel`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to cancel submission');
    }
    
    return response.data.data;
  },

  assignReviewers: async (
    postId: string,
    data: AssignReviewersRequest
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/reviewers`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to assign reviewers');
    }
    
    return response.data.data;
  },

  assignContributors: async (
    postId: string,
    data: AssignContributorsRequest
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/contributors`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to assign contributors');
    }
    
    return response.data.data;
  },

  approvePost: async (postId: string, data: ApprovePostRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/approve`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to approve post');
    }
    
    return response.data.data;
  },

  rejectPost: async (postId: string, data: RejectPostRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/reject`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to reject post');
    }
    
    return response.data.data;
  },

  forcePublish: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/publish`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to publish post');
    }
    
    return response.data.data;
  },

  unpublishPost: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/unpublish`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to unpublish post');
    }
    
    return response.data.data;
  },

  hidePost: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/hide`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to hide post');
    }
    
    return response.data.data;
  },

  clonePost: async (postId: string, data: ClonePostInternalRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/clone`,
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to clone post');
    }
    
    return response.data.data;
  },

  cloneCrossTenant: async (data: CloneCrossTenantRequest): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      '/api/v1/admin/posts/clone-cross-tenant',
      data
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to clone post cross-tenant');
    }
    
    return response.data.data;
  },

  restoreVersion: async (postId: string, version: number): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/restore/${version}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to restore version');
    }
    
    return response.data.data;
  },

  getPostHistories: async (
    postId: string,
    params: KeysetPaginationParams = {}
  ): Promise<KeysetPaginationResponse<PostHistoryAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/${postId}/histories?${queryString}`
      : `/api/v1/admin/posts/${postId}/histories`;
    
    const response = await apiClient.get<
      ApiResponse<KeysetPaginationResponse<PostHistoryAuditView>>
    >(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch post histories');
    }
    
    return response.data.data;
  },

  getPostHistoryById: async (historyId: string): Promise<PostHistoryDetailView> => {
    const response = await apiClient.get<ApiResponse<PostHistoryDetailView>>(
      `/api/v1/admin/posts/histories/${historyId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch history detail');
    }
    
    return response.data.data;
  },

  getReviewSessions: async (
    postId: string,
    params: KeysetPaginationParams = {}
  ): Promise<KeysetPaginationResponse<PostReviewSessionAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/${postId}/reviews?${queryString}`
      : `/api/v1/admin/posts/${postId}/reviews`;
    
    const response = await apiClient.get<
      ApiResponse<KeysetPaginationResponse<PostReviewSessionAuditView>>
    >(url);
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch review sessions');
    }
    
    return response.data.data;
  },

  getReviewSessionById: async (sessionId: string): Promise<PostReviewSessionDetailView> => {
    const response = await apiClient.get<ApiResponse<PostReviewSessionDetailView>>(
      `/api/v1/admin/posts/reviews/${sessionId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch review session');
    }
    
    return response.data.data;
  },

  resolveReviewComment: async (commentId: string): Promise<void> => {
    const response = await apiClient.patch<ApiResponse<void>>(
      `/api/v1/admin/posts/reviews/comments/${commentId}`
    );
    
    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to resolve comment');
    }
  },

  exportToDocx: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/v1/admin/posts/${postId}/export/docx`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportToPdf: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/v1/admin/posts/${postId}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportToZip: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/v1/admin/posts/${postId}/export/zip`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getPromotions: async (
    params: KeysetPaginationParams = {}
  ): Promise<KeysetPaginationResponse<PostPromotionAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/promotions?${queryString}`
      : '/api/v1/admin/posts/promotions';

    const response = await apiClient.get<
      ApiResponse<KeysetPaginationResponse<PostPromotionAuditView>>
    >(url);

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch promotions');
    }

    return response.data.data;
  },

  getPromotionById: async (promotionId: string): Promise<PostPromotionAuditView> => {
    const response = await apiClient.get<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}`
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch promotion');
    }

    return response.data.data;
  },

  requestPromotion: async (sourcePostId: string): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/request/${sourcePostId}`
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to request promotion');
    }

    return response.data.data;
  },

  approvePromotion: async (
    promotionId: string,
    data: ApprovePostPromotionRequest
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}/approve`,
      data
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to approve promotion');
    }

    return response.data.data;
  },

  rejectPromotion: async (
    promotionId: string,
    data: RejectPostPromotionRequest
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}/reject`,
      data
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to reject promotion');
    }

    return response.data.data;
  },

  cancelPromotion: async (promotionId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/promotions/${promotionId}/cancel`
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to cancel promotion');
    }
  },
};
