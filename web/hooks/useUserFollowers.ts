"use client";

import { User } from "@/types";
import { fetchFollowers } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

interface UseUserFollowersReturn {
  followers: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Hook for fetching a user's followers */
export default function useUserFollowers(
  username: string | string[] | undefined
): UseUserFollowersReturn {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("Invalid username");
        setFollowers([]);
        return;
      }

      const followersData = await fetchFollowers(username);
      setFollowers(followersData);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
      setError(err instanceof Error ? err.message : "Failed to load followers");
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchFollowersData();
  }, [fetchFollowersData]);

  return {
    followers,
    loading,
    error,
    refetch: fetchFollowersData,
  };
}
