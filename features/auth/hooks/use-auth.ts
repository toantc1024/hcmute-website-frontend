"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthStore, AuthState, JwtUserProfile } from '../types';
import { authApi, type TokenResponse } from '@/lib/api-client';
import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
  storeCodeVerifier, 
  getCodeVerifier, 
  clearCodeVerifier 
} from '../utils/pkce';
import { parseJwt, isTokenExpired } from '../utils/jwt';
import { buildKeycloakAuthUrl, buildKeycloakLogoutUrl } from '../config/auth-config';

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setInitialized: () => {
        set({ isInitialized: true });
      },

      initiateLogin: async () => {
        try {
          set({ isLoading: true, error: null });

          const codeVerifier = generateCodeVerifier();
          storeCodeVerifier(codeVerifier);

          const codeChallenge = await generateCodeChallenge(codeVerifier);
          const authUrl = buildKeycloakAuthUrl(codeChallenge);

          window.location.href = authUrl;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to initiate login';
          set({ error: message, isLoading: false });
        }
      },

      handleCallback: async (code: string) => {
        try {
          set({ isLoading: true, error: null });

          const codeVerifier = getCodeVerifier();
          if (!codeVerifier) {
            throw new Error('Missing code verifier. Please try logging in again.');
          }

          const tokens: TokenResponse = await authApi.exchangeCode({ code, codeVerifier });
          clearCodeVerifier();

          const user = parseJwt(tokens.accessToken);

          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to complete login';
          set({ error: message, isLoading: false });
          clearCodeVerifier();
          return null;
        }
      },

      refreshSession: async () => {
        const { refreshToken, forceLogout } = get();

        if (!refreshToken) {
          forceLogout();
          return false;
        }

        try {
          const tokens: TokenResponse = await authApi.refreshToken({ refreshToken });
          const user = parseJwt(tokens.accessToken);

          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user,
            error: null,
          });

          return true;
        } catch {
          forceLogout();
          return false;
        }
      },

      getAccessToken: async () => {
        const { accessToken, refreshSession } = get();

        if (!accessToken) {
          return null;
        }

        if (isTokenExpired(accessToken)) {
          const refreshed = await refreshSession();
          if (!refreshed) {
            return null;
          }
          return get().accessToken;
        }

        return accessToken;
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
          error: null,
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }

        const logoutUrl = buildKeycloakLogoutUrl();
        window.location.href = logoutUrl;
      },

      forceLogout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
          error: null,
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/';
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
