"use client";

import FeedLayout from "@/components/FeedLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

export default function PopularPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Loading..." center />;
  }

  return <FeedLayout feedType="popular" user={user || undefined} />;
}
