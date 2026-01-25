import { publicApiClient } from '../axios-instance';
import type { ApiResponse } from '../types';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
  mfaRequired?: boolean;
}

export interface ExchangeCodeRequest {
  code: string;
  codeVerifier: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = {
  exchangeCode: async (data: ExchangeCodeRequest): Promise<TokenResponse> => {
    const response = await publicApiClient.post<ApiResponse<TokenResponse>>(
      '/api/auth/exchange',
      data
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Exchange failed');
    }

    return response.data.data;
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<TokenResponse> => {
    const response = await publicApiClient.post<ApiResponse<TokenResponse>>(
      '/api/auth/refresh-token',
      data
    );

    if (!response.data.result) {
      throw new Error(response.data.message || 'Refresh failed');
    }

    return response.data.data;
  },
};
