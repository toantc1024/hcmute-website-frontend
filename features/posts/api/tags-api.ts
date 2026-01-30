import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
import type {
  TagSimpleView,
  TagAuditView,
  CreateTagRequest,
  UpdateTagRequest,
  KeysetPaginationResponse,
} from "../types";

export interface TagsQueryParams {
  cursor?: string;
  size?: number;
  sort?: string;
  search?: string;
}

// Vietnamese error messages based on error codes
const ERROR_MESSAGES: Record<string, string> = {
  "ERROR-BUSINESS-0002": "Thao tác không được phép",
  "ERROR-BUSINESS-0003": "Dữ liệu không hợp lệ",
  "ERROR-BUSINESS-0005": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
  "ERROR-BUSINESS-0007": "Không tìm thấy thẻ",
  "ERROR-BUSINESS-0008": "Thẻ đã tồn tại",
  "ERROR-SYSTEM-0004": "Bạn không có quyền thực hiện thao tác này",
  "ERROR-SYSTEM-0005": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  "ERROR-SYSTEM-0007": "Dịch vụ tạm thời không khả dụng",
};

// HTTP status code based error messages
const STATUS_MESSAGES: Record<number, string> = {
  400: "Yêu cầu không hợp lệ",
  401: "Vui lòng đăng nhập để tiếp tục",
  403: "Bạn không có quyền thực hiện thao tác này",
  404: "Không tìm thấy thẻ",
  409: "Thẻ đã tồn tại",
  429: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  503: "Dịch vụ tạm thời không khả dụng",
};

// Get Vietnamese error message from API response or status code
function getErrorMessage(
  response: ApiResponse<unknown>,
  defaultMessage: string,
  statusCode?: number,
): string {
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

  if (errorData.code && ERROR_MESSAGES[errorData.code]) {
    return ERROR_MESSAGES[errorData.code];
  }

  if (statusCode && STATUS_MESSAGES[statusCode]) {
    return STATUS_MESSAGES[statusCode];
  }

  return errorData.message || defaultMessage;
}

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

type TagsApiResponse = ApiResponse<
  KeysetPaginationResponse<TagSimpleView> | TagSimpleView[]
>;

export const tagsApi = {
  getTags: async (params: TagsQueryParams = {}): Promise<TagSimpleView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/api/v1/tags?${queryString}` : "/api/v1/tags";

    const response = await apiClient.get<TagsApiResponse>(url);

    if (!response.data.result) {
      throw handleApiError(response, "Không thể tải danh sách thẻ");
    }

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },

  getTagById: async (tagId: string): Promise<TagSimpleView> => {
    const response = await apiClient.get<ApiResponse<TagSimpleView>>(
      `/api/v1/tags/${tagId}`,
    );

    if (!response.data.result) {
      throw handleApiError(response, "Không tìm thấy thẻ");
    }

    return response.data.data;
  },

  createTag: async (name: string): Promise<TagAuditView> => {
    const data: CreateTagRequest = {
      name,
      slug: generateSlug(name),
    };

    const response = await apiClient.post<ApiResponse<TagAuditView>>(
      "/api/v1/admin/tags",
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể tạo thẻ");
    }

    const tagData = response.data.data;
    if (!tagData || !tagData.id) {
      throw new Error("Dữ liệu thẻ không hợp lệ");
    }

    return tagData;
  },

  updateTag: async (
    tagId: string,
    data: UpdateTagRequest,
  ): Promise<TagAuditView> => {
    const response = await apiClient.patch<ApiResponse<TagAuditView>>(
      `/api/v1/admin/tags/${tagId}`,
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể cập nhật thẻ");
    }

    return response.data.data;
  },

  deleteTag: async (tagId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/tags/${tagId}`,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể xóa thẻ");
    }
  },

  getAdminTags: async (
    params: TagsQueryParams = {},
  ): Promise<TagAuditView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/tags?${queryString}`
      : "/api/v1/admin/tags";

    const response =
      await apiClient.get<
        ApiResponse<KeysetPaginationResponse<TagAuditView> | TagAuditView[]>
      >(url);

    if (!response.data.result) {
      throw handleApiError(response, "Không thể tải danh sách thẻ");
    }

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },
};
