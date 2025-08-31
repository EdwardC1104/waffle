"use client";

import FollowLayout from "@/components/FollowLayout";
import { User } from "@/types";
import { fetchFollowers, fetchUser } from "@/utils/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function FollowersPage() {
  const username = useParams().username;
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
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

      const [userData, followersData] = await Promise.all([
        fetchUser(username),
        fetchFollowers(username),
      ]);

      setUser(userData);
      setFollowers(followersData);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
      setError(err instanceof Error ? err.message : "Failed to load followers");
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
      users={followers}
      loading={loading}
      error={error}
      onRetry={fetchData}
      type="followers"
    />
  );
}
