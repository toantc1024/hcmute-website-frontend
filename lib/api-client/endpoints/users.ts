import { apiClient } from "../axios-instance";
import type { ApiResponse } from "../types";

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles?: string[];
  [key: string]: unknown;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

// ---- Admin user management types ----

export type AccountStatus = "ACTIVE" | "BLOCKED" | "PENDING";

export interface GroupSimpleView {
  id: string;
  code: string;
  groupName: string;
}

export interface AdminUserView {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  account: {
    id: string;
    email: string;
    provider: string;
    providerId: string;
    status: AccountStatus;
    groups: GroupSimpleView[];
    lastLoginAt?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  status?: AccountStatus;
  groupCode?: string;
}

export interface AdminUsersPaginatedResponse {
  content: AdminUserView[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasMore: boolean;
}

export interface UpdateUserStatusRequest {
  status: AccountStatus;
}

export interface UpdateUserGroupsRequest {
  groupIds: string[];
}

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      "/api/v1/users/profile",
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch profile");
    }

    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/api/v1/users/profile",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    return response.data.data;
  },

  // ---- Admin user management ----

  getUsers: async (
    params?: AdminUsersQueryParams,
  ): Promise<AdminUsersPaginatedResponse> => {
    const response = await apiClient.get<
      ApiResponse<AdminUsersPaginatedResponse>
    >("/api/v1/admin/users", { params });

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch users");
    }

    return response.data.data;
  },

  getUserById: async (userId: string): Promise<AdminUserView> => {
    const response = await apiClient.get<ApiResponse<AdminUserView>>(
      `/api/v1/admin/users/${userId}`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch user");
    }

    return response.data.data;
  },

  updateUserStatus: async (
    userId: string,
    data: UpdateUserStatusRequest,
  ): Promise<AdminUserView> => {
    const response = await apiClient.patch<ApiResponse<AdminUserView>>(
      `/api/v1/admin/users/${userId}/status`,
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update user status");
    }

    return response.data.data;
  },

  updateUserGroups: async (
    userId: string,
    data: UpdateUserGroupsRequest,
  ): Promise<AdminUserView> => {
    const response = await apiClient.put<ApiResponse<AdminUserView>>(
      `/api/v1/admin/users/${userId}/groups`,
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to update user groups");
    }

    return response.data.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/users/${userId}`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to delete user");
    }
  },
};
