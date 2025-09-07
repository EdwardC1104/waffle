import { User } from "@/types";
import { fetchUser } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

interface UseProfileUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching a user's profile data by username
 */
export default function useProfileUser(
  username: string | string[] | undefined
): UseProfileUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("Invalid username");
        setUser(null);
        return;
      }

      const userData = await fetchUser(username);
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    user,
    loading,
    error,
    refetch: fetchUserData,
  };
}
