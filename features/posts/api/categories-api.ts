import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
import type {
  CategorySimpleView,
  CategoryAuditView,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  KeysetPaginationResponse,
} from "../types";

export interface CategoriesQueryParams {
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
  "ERROR-BUSINESS-0007": "Không tìm thấy danh mục",
  "ERROR-BUSINESS-0008": "Danh mục đã tồn tại",
  "ERROR-SYSTEM-0004": "Bạn không có quyền thực hiện thao tác này",
  "ERROR-SYSTEM-0005": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  "ERROR-SYSTEM-0007": "Dịch vụ tạm thời không khả dụng",
};

// HTTP status code based error messages
const STATUS_MESSAGES: Record<number, string> = {
  400: "Yêu cầu không hợp lệ",
  401: "Vui lòng đăng nhập để tiếp tục",
  403: "Bạn không có quyền thực hiện thao tác này",
  404: "Không tìm thấy danh mục",
  409: "Danh mục đã tồn tại",
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

type CategoriesApiResponse = ApiResponse<
  KeysetPaginationResponse<CategorySimpleView> | CategorySimpleView[]
>;

export const categoriesApi = {
  getCategories: async (
    params: CategoriesQueryParams = {},
  ): Promise<CategorySimpleView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/categories?${queryString}`
      : "/api/v1/categories";

    const response = await apiClient.get<CategoriesApiResponse>(url);

    if (!response.data.result) {
      throw handleApiError(response, "Không thể tải danh sách danh mục");
    }

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },

  getCategoryById: async (categoryId: string): Promise<CategorySimpleView> => {
    const response = await apiClient.get<ApiResponse<CategorySimpleView>>(
      `/api/v1/categories/${categoryId}`,
    );

    if (!response.data.result) {
      throw handleApiError(response, "Không tìm thấy danh mục");
    }

    return response.data.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>(
      "/api/v1/admin/categories",
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể tạo danh mục");
    }

    return response.data.data;
  },

  updateCategory: async (
    categoryId: string,
    data: UpdateCategoryRequest,
  ): Promise<void> => {
    const response = await apiClient.patch<ApiResponse<void>>(
      `/api/v1/admin/categories/${categoryId}`,
      data,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể cập nhật danh mục");
    }
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/categories/${categoryId}`,
    );

    if (
      response.status < 200 ||
      response.status >= 300 ||
      !response.data.result
    ) {
      throw handleApiError(response, "Không thể xóa danh mục");
    }
  },

  getAdminCategories: async (
    params: CategoriesQueryParams = {},
  ): Promise<CategoryAuditView[]> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `/api/v1/admin/categories?${queryString}`
      : "/api/v1/admin/categories";

    const response =
      await apiClient.get<
        ApiResponse<
          KeysetPaginationResponse<CategoryAuditView> | CategoryAuditView[]
        >
      >(url);

    if (!response.data.result) {
      throw handleApiError(response, "Không thể tải danh sách danh mục");
    }

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },
};
