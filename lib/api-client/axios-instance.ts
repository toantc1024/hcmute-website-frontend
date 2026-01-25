import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import type { ApiResponse } from './types';

type TokenGetter = () => Promise<string | null>;
type ForceLogout = () => void;

let getAccessToken: TokenGetter | null = null;
let forceLogout: ForceLogout | null = null;

export function setAuthHandlers(
  tokenGetter: TokenGetter,
  logoutHandler: ForceLogout
) {
  getAccessToken = tokenGetter;
  forceLogout = logoutHandler;
}

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.set('X-Tenant-ID', API_CONFIG.tenantId);

    if (getAccessToken && !config.headers.has('Authorization')) {
      const token = await getAccessToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      if (forceLogout) {
        forceLogout();
      }
    }

    const message = error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export const publicApiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

publicApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set('X-Tenant-ID', API_CONFIG.tenantId);
    return config;
  },
  (error) => Promise.reject(error)
);

publicApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message = error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);
