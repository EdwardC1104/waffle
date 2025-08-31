"use client";

import FollowLayout from "@/components/FollowLayout";
import useProfile from "@/hooks/useProfile";

export default function FollowingPage() {
  const { user, following, loading, error, refetch } = useProfile('following');

  return (
    <FollowLayout
      user={user}
      users={following}
      loading={loading}
      error={error}
      onRetry={refetch}
      type="following"
    />
  );
}
