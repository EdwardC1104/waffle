"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface AuthenticatedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingText?: string;
}

/** Component that ensures its children are only rendered if the user is authenticated.
 *  Otherwise, it redirects to the specified login page. */
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
    return <LoadingSpinner text={loadingText} center />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
