"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
import {
  type UserDetailView,
  type UserRole,
  extractRolesFromGroups,
  getHighestRole,
} from "../types";

interface UserProfileContextValue {
  profile: UserDetailView | null;
  roles: UserRole[];
  highestRole: UserRole;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { accessToken, isInitialized } = useAuth();
  const [profile, setProfile] = useState<UserDetailView | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(['USER']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<ApiResponse<UserDetailView>>(
        '/api/v1/users/profile'
      );

      if (response.data.result && response.data.data) {
        const userProfile = response.data.data;
        setProfile(userProfile);
        
        const extractedRoles = extractRolesFromGroups(
          userProfile.account?.groups || []
        );
        setRoles(extractedRoles);
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setRoles(['USER']);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isInitialized && accessToken) {
      fetchProfile();
    } else if (isInitialized && !accessToken) {
      setIsLoading(false);
    }
  }, [isInitialized, accessToken, fetchProfile]);

  const highestRole = getHighestRole(roles);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        roles,
        highestRole,
        isLoading,
        error,
        refetch: fetchProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
