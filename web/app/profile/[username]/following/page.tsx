"use client";

import FollowLayout from "@/components/FollowLayout";
import { User } from "@/types";
import { fetchFollowing, fetchUser } from "@/utils/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function FollowingPage() {
  const username = useParams().username;
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("No username provided in URL");
        return;
      }

      const [userData, followingData] = await Promise.all([
        fetchUser(username),
        fetchFollowing(username),
      ]);

      setUser(userData);
      setFollowing(followingData);
    } catch (err) {
      console.error("Failed to fetch following:", err);
      setError(err instanceof Error ? err.message : "Failed to load following");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FollowLayout
      user={user}
      users={following}
      loading={loading}
      error={error}
      onRetry={fetchData}
      type="following"
    />
  );
}
