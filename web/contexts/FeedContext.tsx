"use client";

import useAuth from "@/hooks/useAuth";
import { FeedType, Post } from "@/types";
import {
  fetchFollowingFeed,
  fetchFypFeed,
  fetchPopularFeed,
} from "@/utils/api";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Types
interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface FeedContextType {
  feeds: Record<FeedType, FeedState>;
  loadFeed: (feedType: FeedType) => Promise<void>;
  refreshFeed: (feedType: FeedType) => Promise<void>;
  updatePostInAllFeeds: (updatedPost: Post) => void;
  removePostFromAllFeeds: (postId: number) => void;
}

// Helper constants
const FEED_FETCHERS = {
  popular: fetchPopularFeed,
  following: fetchFollowingFeed,
  fyp: fetchFypFeed,
} as const;

const INITIAL_FEED_STATE: FeedState = {
  posts: [],
  loading: true,
  error: null,
};

// Context
const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Provider
export function FeedProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  const [feeds, setFeeds] = useState<Record<FeedType, FeedState>>(() => ({
    popular: { ...INITIAL_FEED_STATE },
    following: { ...INITIAL_FEED_STATE },
    fyp: { ...INITIAL_FEED_STATE },
  }));

  const updateFeedState = useCallback(
    (feedType: FeedType, updates: Partial<FeedState>) => {
      setFeeds((prev) => ({
        ...prev,
        [feedType]: {
          ...prev[feedType],
          ...updates,
        },
      }));
    },
    []
  );

  const fetchFeedData = useCallback(
    async (feedType: FeedType, isRefresh = false) => {
      if (
        (feedType === "following" || feedType === "fyp") &&
        !isAuthenticated
      ) {
        updateFeedState(feedType, {
          error: "Authentication required to view this feed",
          loading: false,
        });
        return;
      }

      updateFeedState(feedType, {
        loading: true,
        error: null,
      });

      try {
        const posts = await FEED_FETCHERS[feedType]();

        updateFeedState(feedType, {
          posts,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(
          `Failed to ${isRefresh ? "refresh" : "fetch"} ${feedType} feed:`,
          error
        );

        updateFeedState(feedType, {
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : `Failed to load ${feedType} feed`,
        });
      }
    },
    [isAuthenticated, updateFeedState]
  );

  const loadFeed = useCallback(
    (feedType: FeedType) => fetchFeedData(feedType, false),
    [fetchFeedData]
  );

  const refreshFeed = useCallback(
    (feedType: FeedType) => fetchFeedData(feedType, true),
    [fetchFeedData]
  );

  // Reset feeds when user logs in or out
  useEffect(() => {
    if (!isLoading) {
      setFeeds({
        popular: { ...INITIAL_FEED_STATE },
        following: { ...INITIAL_FEED_STATE },
        fyp: { ...INITIAL_FEED_STATE },
      });
    }
  }, [isAuthenticated, isLoading]);

  const updatePostInAllFeeds = useCallback((updatedPost: Post) => {
    setFeeds((prev) => {
      const updated = { ...prev };

      // Update the post in all feeds that contain it
      for (const feedType of Object.keys(updated) as FeedType[]) {
        const feed = updated[feedType];
        if (!feed.loading || feed.posts.length > 0) {
          const postIndex = feed.posts.findIndex(
            (post) => post.id === updatedPost.id
          );
          if (postIndex !== -1) {
            updated[feedType] = {
              ...feed,
              posts: feed.posts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post
              ),
            };
          }
        }
      }

      return updated;
    });
  }, []);

  const removePostFromAllFeeds = useCallback((postId: number) => {
    setFeeds((prev) => {
      const updated = { ...prev };

      // Remove the post from all feeds that contain it
      for (const feedType of Object.keys(updated) as FeedType[]) {
        const feed = updated[feedType];
        if (!feed.loading || feed.posts.length > 0) {
          const hasPost = feed.posts.some((post) => post.id === postId);
          if (hasPost) {
            updated[feedType] = {
              ...feed,
              posts: feed.posts.filter((post) => post.id !== postId),
            };
          }
        }
      }

      return updated;
    });
  }, []);

  const value: FeedContextType = {
    feeds,
    loadFeed,
    refreshFeed,
    updatePostInAllFeeds,
    removePostFromAllFeeds,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeedContext(): FeedContextType {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error("useFeedContext must be used within a FeedProvider");
  }
  return context;
}
