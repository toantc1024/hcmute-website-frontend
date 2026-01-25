"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCallback, isLoading, clearError } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    
    if (errorParam || !code) {
      hasProcessed.current = true;
      clearError();
      router.replace("/");
      return;
    }
    
    hasProcessed.current = true;
    
    handleCallback(code).then((user) => {
      if (user) {
        router.replace("/protected");
      } else {
        clearError();
        router.replace("/");
      }
    });
  }, [searchParams, handleCallback, router, clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <h1 className="text-2xl font-bold">Processing Login...</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Exchanging authorization code for tokens..." : "Please wait..."}
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
