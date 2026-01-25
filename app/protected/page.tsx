"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth";
import { usersApi, type UserProfile } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw, User } from "lucide-react";

export default function ProtectedPage() {
  const { user, accessToken, logout } = useAuth();
  const [backendProfile, setBackendProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadBackendProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError(null);
    
    try {
      const profile = await usersApi.getProfile();
      setBackendProfile(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load profile";
      setProfileError(message);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      loadBackendProfile();
    }
  }, [accessToken, loadBackendProfile]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8" />
            Protected Area
          </h1>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">JWT Token Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Extracted from access token (Keycloak)
            </p>
            <pre className="p-4 bg-muted rounded-md text-sm overflow-auto max-h-96">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Backend Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Fetched from /api/auth/me
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadBackendProfile}
                disabled={isLoadingProfile}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProfile ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {isLoadingProfile ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : profileError ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                <p className="font-medium">Error loading profile:</p>
                <p className="text-sm">{profileError}</p>
              </div>
            ) : backendProfile ? (
              <pre className="p-4 bg-muted rounded-md text-sm overflow-auto max-h-96">
                {JSON.stringify(backendProfile, null, 2)}
              </pre>
            ) : (
              <div className="p-4 bg-muted rounded-md text-muted-foreground">
                No profile data available
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Access Token</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Current JWT access token (click to copy)
          </p>
          <pre 
            className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-32 cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => {
              if (accessToken) {
                navigator.clipboard.writeText(accessToken);
                alert("Access token copied to clipboard!");
              }
            }}
          >
            {accessToken}
          </pre>
        </div>
      </div>
    </div>
  );
}
