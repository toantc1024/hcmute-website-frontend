"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/features/auth";
import { setAuthHandlers } from "@/lib/api-client";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setInitialized, accessToken, refreshSession, getAccessToken, forceLogout } = useAuth();

  useEffect(() => {
    setAuthHandlers(getAccessToken, forceLogout);

    const initAuth = async () => {
      if (accessToken) {
        await refreshSession();
      }
      setInitialized();
    };

    initAuth();
  }, []);

  return <>{children}</>;
}
