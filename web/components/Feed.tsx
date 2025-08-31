"use client";

import { useEffect, useState } from "react";
import { Post } from "../types";
import {
  fetchFollowingFeed,
  fetchFypFeed,
  fetchPopularFeed,
} from "../utils/api";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import PostCard from "./PostCard";

interface FeedProps {
  feedType: "fyp" | "following" | "popular";
  username?: string; // Required for fyp and following feeds
}

export default function Feed({ feedType, username }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        setError(null);

        let feedPosts: Post[] = [];
        switch (feedType) {
          case "popular":
            feedPosts = await fetchPopularFeed();
            break;
          case "following":
            if (!username)
              throw new Error("Username required for following feed");
            feedPosts = await fetchFollowingFeed(username);
            break;
          case "fyp":
            if (!username) throw new Error("Username required for FYP feed");
            feedPosts = await fetchFypFeed(username);
            break;
        }

        setPosts(feedPosts);
      } catch (err) {
        console.error("Failed to fetch feed data:", err);
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [feedType, username]);

  if (loading) {
    return <LoadingSpinner text="Loading feed..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Feed"
        message={error}
        onRetry={() => window.location.reload()}
        showRetryButton={true}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
      ))}
    </div>
  );
}
