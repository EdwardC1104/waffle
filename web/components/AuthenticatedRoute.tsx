"use client";

import useAuth from "@/hooks/useAuth";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface AuthenticatedRouteProps {
  children: (user: User) => ReactNode;
  redirectTo?: string;
  loadingText?: string;
}

export function AuthenticatedRoute({
  children,
  redirectTo = "/login",
  loadingText = "Loading...",
}: AuthenticatedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return <LoadingSpinner text={loadingText} fullPage center />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children(user)}</>;
}
