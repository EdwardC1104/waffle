"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/feed/fyp");
      } else {
        router.push("/feed/popular");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingSpinner center />;
}
