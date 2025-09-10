"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
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
  const desiredPath = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(desiredPath)}`;
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, desiredPath]);

  if (isLoading) {
    return <LoadingSpinner text={loadingText} center />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
