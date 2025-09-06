"use client";

import { useEffect, useState } from "react";
import { Post } from "../types";
import {
  fetchFollowingFeed,
  fetchFypFeed,
  fetchPopularFeed,
} from "../utils/api";
import ErrorMessage from "./General/ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import PostCard from "./PostCard";

interface FeedProps {
  feedType: "fyp" | "following" | "popular";
}

export default function Feed({ feedType }: FeedProps) {
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
            feedPosts = await fetchFollowingFeed();
            break;
          case "fyp":
            feedPosts = await fetchFypFeed();
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
  }, [feedType]);

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
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
        ))
      ) : (
        <p className="self-center text-zinc-600">
          {feedType === "following"
            ? "You don't follow anyone yet."
            : "Nothing to see here..."}
        </p>
      )}
    </div>
  );
}
