"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedType, Post } from "../types";
import {
  fetchFollowingFeed,
  fetchFypFeed,
  fetchPopularFeed,
} from "../utils/api";

interface UseFeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updatePost: (updatedPost: Post) => void;
}

const FEED_FETCHERS = {
  popular: fetchPopularFeed,
  following: fetchFollowingFeed,
  fyp: fetchFypFeed,
} as const;

const FEED_ERROR_MESSAGES = {
  popular: "Failed to load popular posts",
  following: "Failed to load posts from people you follow",
  fyp: "Failed to load your personalised feed",
} as const;

/** Manages the state and logic for fetching and updating the feed based on the selected feed type */
export function useFeed(feedType: FeedType): UseFeedState {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const feedFetcher = FEED_FETCHERS[feedType];
      const feedPosts = await feedFetcher();

      setPosts(feedPosts);
    } catch (err) {
      console.error(`Failed to fetch ${feedType} feed:`, err);
      const errorMessage =
        err instanceof Error ? err.message : FEED_ERROR_MESSAGES[feedType];
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [feedType]);

  const refresh = useCallback(async () => {
    await fetchFeedData();
  }, [fetchFeedData]);

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }, []);

  useEffect(() => {
    fetchFeedData();
  }, [fetchFeedData]);

  return {
    posts,
    loading,
    error,
    refresh,
    updatePost,
  };
}
