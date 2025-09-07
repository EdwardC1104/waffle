"use client";

import { Post } from "@/types";
import { fetchUserPosts } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

interface UseUserPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  handlePostUpdate: (updatedPost: Post) => void;
}

/** Hook for fetching a user's posts */
export default function useUserPosts(
  username: string | string[] | undefined
): UseUserPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePostUpdate = useCallback((updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("Invalid username");
        setPosts([]);
        return;
      }

      const postsData = await fetchUserPosts(username);
      setPosts(postsData);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    handlePostUpdate,
  };
}
