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
  removePost: (postId: number) => void;
}

/** Hook that provides access to a given feed with caching. */
export function useFeed(feedType: FeedType): UseFeedReturn {
  const { feeds, loadFeed, refreshFeed, updatePostInAllFeeds, removePostFromAllFeeds } =
    useFeedContext();

  const feedState = feeds[feedType];

  useEffect(() => {
    // Only load if the feed hasn't been loaded yet
    // A feed is considered "not loaded" if it's in the initial loading state
    // (loading: true, no posts, no error)
    if (feedState.loading && feedState.posts.length === 0 && !feedState.error) {
      loadFeed(feedType);
    }
  }, [
    feedType,
    feedState.loading,
    feedState.posts.length,
    feedState.error,
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

  const removePost = useCallback(
    (postId: number) => {
      removePostFromAllFeeds(postId);
    },
    [removePostFromAllFeeds]
  );

  return {
    posts: feedState.posts,
    loading: feedState.loading,
    error: feedState.error,
    refresh,
    updatePost,
    removePost,
  };
}
