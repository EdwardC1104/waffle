"use client";

import { useEffect, useState } from "react";
import { Post } from "../types";
import { getFollowingFeed, getFypFeed, getPopularFeed } from "../utils/api";
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

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        setError(null);

        let feedPosts: Post[] = [];
        switch (feedType) {
          case "popular":
            feedPosts = await getPopularFeed();
            break;
          case "following":
            if (!username)
              throw new Error("Username required for following feed");
            feedPosts = await getFollowingFeed(username);
            break;
          case "fyp":
            if (!username) throw new Error("Username required for FYP feed");
            feedPosts = await getFypFeed(username);
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
      <div className="text-center">
        <p className="text-red-600 mb-4">Error loading feed: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
