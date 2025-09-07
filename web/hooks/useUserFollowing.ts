"use client";

import { User } from "@/types";
import { fetchFollowing } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

interface UseUserFollowingReturn {
  following: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Hook for fetching users that a user is following */
export default function useUserFollowing(
  username: string | string[] | undefined
): UseUserFollowingReturn {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("Invalid username");
        setFollowing([]);
        return;
      }

      const followingData = await fetchFollowing(username);
      setFollowing(followingData);
    } catch (err) {
      console.error("Failed to fetch following:", err);
      setError(err instanceof Error ? err.message : "Failed to load following");
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchFollowingData();
  }, [fetchFollowingData]);

  return {
    following,
    loading,
    error,
    refetch: fetchFollowingData,
  };
}
