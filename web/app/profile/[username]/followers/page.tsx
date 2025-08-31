"use client";

import FollowLayout from "@/components/FollowLayout";
import useProfile from "@/hooks/useProfile";

export default function FollowersPage() {
  const { user, followers, loading, error, refetch } = useProfile({
    includePosts: false,
    includeFollowers: true,
  });

  return (
    <FollowLayout
      user={user}
      users={followers}
      loading={loading}
      error={error}
      onRetry={refetch}
      type="followers"
    />
  );
}
