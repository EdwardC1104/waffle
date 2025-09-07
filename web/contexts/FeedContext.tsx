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
  hasLoaded: boolean;
}

interface FeedContextType {
  feeds: Record<FeedType, FeedState>;
  loadFeed: (feedType: FeedType) => Promise<void>;
  refreshFeed: (feedType: FeedType) => Promise<void>;
  updatePostInAllFeeds: (updatedPost: Post) => void;
}

// Helper constants
const FEED_FETCHERS = {
  popular: fetchPopularFeed,
  following: fetchFollowingFeed,
  fyp: fetchFypFeed,
} as const;

const INITIAL_FEED_STATE: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasLoaded: false,
};

// Context
const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Provider
export function FeedProvider({ children }: { children: ReactNode }) {
  const [feeds, setFeeds] = useState<Record<FeedType, FeedState>>(() => ({
    popular: { ...INITIAL_FEED_STATE },
    following: { ...INITIAL_FEED_STATE },
    fyp: { ...INITIAL_FEED_STATE },
  }));
  const { isAuthenticated } = useAuth();

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
          hasLoaded: true,
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
          hasLoaded: false,
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

  // Reset feeds when authentication state changes
  useEffect(() => {
    setFeeds({
      popular: { ...INITIAL_FEED_STATE },
      following: { ...INITIAL_FEED_STATE },
      fyp: { ...INITIAL_FEED_STATE },
    });
  }, [isAuthenticated]);

  const updatePostInAllFeeds = useCallback((updatedPost: Post) => {
    setFeeds((prev) => {
      const updated = { ...prev };

      // Update the post in all feeds that contain it
      for (const feedType of Object.keys(updated) as FeedType[]) {
        const feed = updated[feedType];
        if (feed.hasLoaded) {
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

  const value: FeedContextType = {
    feeds,
    loadFeed,
    refreshFeed,
    updatePostInAllFeeds,
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
