import { apiClient } from '../axios-instance';
import type { ApiResponse } from '../types';

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

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      '/api/v1/users/profile'
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }

    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/api/v1/users/profile',
      data
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Failed to update profile');
    }

    return response.data.data;
  },
};
