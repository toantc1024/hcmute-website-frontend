import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
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
} from "../types";

// Vietnamese error messages based on error codes
const ERROR_MESSAGES: Record<string, string> = {
  "ERROR-BUSINESS-0002": "Thao tác không được phép",
  "ERROR-BUSINESS-0003": "Dữ liệu không hợp lệ",
  "ERROR-BUSINESS-0005": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
  "ERROR-BUSINESS-0007": "Không tìm thấy dữ liệu",
  "ERROR-BUSINESS-0008": "Dữ liệu đã tồn tại",
  "ERROR-SYSTEM-0004": "Bạn không có quyền thực hiện thao tác này",
  "ERROR-SYSTEM-0005": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  "ERROR-SYSTEM-0007": "Dịch vụ tạm thời không khả dụng",
};

// HTTP status code based error messages
const STATUS_MESSAGES: Record<number, string> = {
  400: "Yêu cầu không hợp lệ",
  401: "Vui lòng đăng nhập để tiếp tục",
  403: "Bạn không có quyền thực hiện thao tác này",
  404: "Không tìm thấy dữ liệu",
  409: "Dữ liệu đã tồn tại hoặc xung đột",
  429: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  503: "Dịch vụ tạm thời không khả dụng",
};

// Get Vietnamese error message from API response or status code
function getErrorMessage(
  response: ApiResponse<unknown>,
  defaultMessage: string,
  statusCode?: number,
): string {
  // Check for field validation errors
  const errorData = response as unknown as {
    code?: string;
    data?: Array<{ field: string; message: string }>;
    message?: string;
  };

  if (
    errorData.data &&
    Array.isArray(errorData.data) &&
    errorData.data.length > 0
  ) {
    return errorData.data.map((e) => e.message).join(". ");
  }

  // Check for known error codes
  if (errorData.code && ERROR_MESSAGES[errorData.code]) {
    return ERROR_MESSAGES[errorData.code];
  }

  // Check for status code based messages
  if (statusCode && STATUS_MESSAGES[statusCode]) {
    return STATUS_MESSAGES[statusCode];
  }

  // Return server message or default
  return errorData.message || defaultMessage;
}

// Get error from API response with status handling
function handleApiError(
  response: { data: ApiResponse<unknown>; status: number },
  defaultMessage: string,
): Error {
  return new Error(
    getErrorMessage(response.data, defaultMessage, response.status),
  );
}

function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export const postsApi = {
  getPosts: async (
    params: PostsQueryParams = {},
  ): Promise<KeysetPaginationResponse<PostAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts?${queryString}`
      : "/api/v1/admin/posts";

    const response =
      await apiClient.get<ApiResponse<KeysetPaginationResponse<PostAuditView>>>(
        url,
      );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể tải danh sách bài viết"),
      );
    }

    return response.data.data;
  },

  getPostById: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.get<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể tải bài viết"));
    }

    return response.data.data;
  },

  createPost: async (data: CreatePostRequest): Promise<string> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      "/api/v1/admin/posts",
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result ||
      !response.data.data
    ) {
      throw handleApiError(response, "Không thể tạo bài viết");
    }

    // Return the created post ID
    return response.data.data.id;
  },

  updatePost: async (
    postId: string,
    data: UpdatePostRequest,
  ): Promise<void> => {
    const response = await apiClient.put<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}`,
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể cập nhật bài viết");
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/${postId}`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể xóa bài viết"));
    }
  },

  acquireLock: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.post<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể khóa bài viết"),
      );
    }

    return response.data.data;
  },

  renewLock: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.put<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể gia hạn khóa"));
    }

    return response.data.data;
  },

  releaseLock: async (postId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/${postId}/lock`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể mở khóa"));
    }
  },

  getLockStatus: async (postId: string): Promise<LockDto> => {
    const response = await apiClient.get<ApiResponse<LockDto>>(
      `/api/v1/admin/posts/${postId}/lock`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể lấy trạng thái khóa"),
      );
    }

    return response.data.data;
  },

  submitPost: async (
    postId: string,
    data: SubmitPostRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/submit`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể gửi duyệt bài viết"),
      );
    }

    return response.data.data;
  },

  cancelSubmission: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/cancel`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể hủy gửi duyệt"),
      );
    }

    return response.data.data;
  },

  assignReviewers: async (
    postId: string,
    data: AssignReviewersRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/reviewers`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể chỉ định người duyệt"),
      );
    }

    return response.data.data;
  },

  assignContributors: async (
    postId: string,
    data: AssignContributorsRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/contributors`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể chỉ định người đóng góp"),
      );
    }

    return response.data.data;
  },

  approvePost: async (
    postId: string,
    data: ApprovePostRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/approve`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể duyệt bài viết"),
      );
    }

    return response.data.data;
  },

  rejectPost: async (
    postId: string,
    data: RejectPostRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/reject`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể từ chối bài viết"),
      );
    }

    return response.data.data;
  },

  forcePublish: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/publish`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể xuất bản bài viết"),
      );
    }

    return response.data.data;
  },

  unpublishPost: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/unpublish`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể gỡ xuất bản"));
    }

    return response.data.data;
  },

  hidePost: async (postId: string): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/hide`,
    );

    if (!response.data.result) {
      throw new Error(getErrorMessage(response.data, "Không thể ẩn bài viết"));
    }

    return response.data.data;
  },

  clonePost: async (
    postId: string,
    data: ClonePostInternalRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/clone`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể nhân bản bài viết"),
      );
    }

    return response.data.data;
  },

  cloneCrossTenant: async (
    data: CloneCrossTenantRequest,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      "/api/v1/admin/posts/clone-cross-tenant",
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể nhân bản bài viết từ đơn vị khác",
        ),
      );
    }

    return response.data.data;
  },

  restoreVersion: async (
    postId: string,
    version: number,
  ): Promise<PostDetailView> => {
    const response = await apiClient.post<ApiResponse<PostDetailView>>(
      `/api/v1/admin/posts/${postId}/restore/${version}`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể khôi phục phiên bản"),
      );
    }

    return response.data.data;
  },

  getPostHistories: async (
    postId: string,
    params: KeysetPaginationParams = {},
  ): Promise<KeysetPaginationResponse<PostHistoryAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/${postId}/histories?${queryString}`
      : `/api/v1/admin/posts/${postId}/histories`;

    const response =
      await apiClient.get<
        ApiResponse<KeysetPaginationResponse<PostHistoryAuditView>>
      >(url);

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể tải lịch sử bài viết"),
      );
    }

    return response.data.data;
  },

  getPostHistoryById: async (
    historyId: string,
  ): Promise<PostHistoryDetailView> => {
    const response = await apiClient.get<ApiResponse<PostHistoryDetailView>>(
      `/api/v1/admin/posts/histories/${historyId}`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể tải chi tiết lịch sử"),
      );
    }

    return response.data.data;
  },

  getReviewSessions: async (
    postId: string,
    params: KeysetPaginationParams = {},
  ): Promise<KeysetPaginationResponse<PostReviewSessionAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/${postId}/reviews?${queryString}`
      : `/api/v1/admin/posts/${postId}/reviews`;

    const response =
      await apiClient.get<
        ApiResponse<KeysetPaginationResponse<PostReviewSessionAuditView>>
      >(url);

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể tải phiên duyệt"),
      );
    }

    return response.data.data;
  },

  getReviewSessionById: async (
    sessionId: string,
  ): Promise<PostReviewSessionDetailView> => {
    const response = await apiClient.get<
      ApiResponse<PostReviewSessionDetailView>
    >(`/api/v1/admin/posts/reviews/${sessionId}`);

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể tải chi tiết phiên duyệt"),
      );
    }

    return response.data.data;
  },

  resolveReviewComment: async (commentId: string): Promise<void> => {
    const response = await apiClient.patch<ApiResponse<void>>(
      `/api/v1/admin/posts/reviews/comments/${commentId}`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(response.data, "Không thể đánh dấu đã giải quyết"),
      );
    }
  },

  exportToDocx: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/v1/admin/posts/${postId}/export/docx`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  exportToPdf: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/v1/admin/posts/${postId}/export/pdf`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  exportToZip: async (postId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/v1/admin/posts/${postId}/export/zip`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  getPromotions: async (
    params: KeysetPaginationParams = {},
  ): Promise<KeysetPaginationResponse<PostPromotionAuditView>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/posts/promotions?${queryString}`
      : "/api/v1/admin/posts/promotions";

    const response =
      await apiClient.get<
        ApiResponse<KeysetPaginationResponse<PostPromotionAuditView>>
      >(url);

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể tải danh sách yêu cầu đăng lên cấp trên",
        ),
      );
    }

    return response.data.data;
  },

  getPromotionById: async (
    promotionId: string,
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.get<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể tải chi tiết yêu cầu đăng lên cấp trên",
        ),
      );
    }

    return response.data.data;
  },

  requestPromotion: async (
    sourcePostId: string,
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/request/${sourcePostId}`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể gửi yêu cầu đăng lên cấp trên",
        ),
      );
    }

    return response.data.data;
  },

  approvePromotion: async (
    promotionId: string,
    data: ApprovePostPromotionRequest,
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}/approve`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể phê duyệt yêu cầu đăng lên cấp trên",
        ),
      );
    }

    return response.data.data;
  },

  rejectPromotion: async (
    promotionId: string,
    data: RejectPostPromotionRequest,
  ): Promise<PostPromotionAuditView> => {
    const response = await apiClient.post<ApiResponse<PostPromotionAuditView>>(
      `/api/v1/admin/posts/promotions/${promotionId}/reject`,
      data,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể từ chối yêu cầu đăng lên cấp trên",
        ),
      );
    }

    return response.data.data;
  },

  cancelPromotion: async (promotionId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/posts/promotions/${promotionId}/cancel`,
    );

    if (!response.data.result) {
      throw new Error(
        getErrorMessage(
          response.data,
          "Không thể hủy yêu cầu đăng lên cấp trên",
        ),
      );
    }
  },
};
