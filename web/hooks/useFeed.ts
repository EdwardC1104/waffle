"use client";

import { useFeedContext } from "@/contexts/FeedContext";
import { FeedType, Post } from "@/types";
import { useCallback, useEffect } from "react";

interface UseFeedReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updatePost: (updatedPost: Post) => void;
}

/**
 * Hook that provides access to a specific feed with caching.
 * Only fetches the feed the first time it's accessed.
 */
export function useFeed(feedType: FeedType): UseFeedReturn {
  const { feeds, loadFeed, refreshFeed, updatePostInAllFeeds } =
    useFeedContext();

  const feedState = feeds[feedType];

  // Load the feed when the hook is first used or when feeds are reset
  useEffect(() => {
    // Only load if not currently loading, hasn't been loaded yet, and no posts
    if (
      !feedState.loading &&
      !feedState.hasLoaded &&
      feedState.posts.length === 0
    ) {
      loadFeed(feedType);
    }
  }, [
    feedType,
    feedState.loading,
    feedState.hasLoaded,
    feedState.posts.length,
    loadFeed,
  ]);

  const refresh = useCallback(async () => {
    await refreshFeed(feedType);
  }, [feedType, refreshFeed]);

  const updatePost = useCallback(
    (updatedPost: Post) => {
      updatePostInAllFeeds(updatedPost);
    },
    [updatePostInAllFeeds]
  );

  return {
    posts: feedState.posts,
    loading: feedState.loading,
    error: feedState.error,
    refresh,
    updatePost,
  };
}
