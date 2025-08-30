"use client";

import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Post, User } from "../types";
import {
  getFollowingFeed,
  getFypFeed,
  getPopularFeed,
  getSuggestedUsers,
} from "../utils/api";
import PostCard from "./PostCard";
import UserProfile from "./UserProfile";
import WhoToFollow from "./WhoToFollow";
import WritePostCTA from "./WritePostCTA";

interface FeedProps {
  feedType?: "fyp" | "following" | "popular";
}

export default function Feed({ feedType = "fyp" }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts based on feed type
        let feedPosts: Post[];
        switch (feedType) {
          case "popular":
            feedPosts = await getPopularFeed();
            break;
          case "following":
            feedPosts = await getFollowingFeed(user?.username || "");
            break;
          case "fyp":
          default:
            feedPosts = await getFypFeed(user?.username || "");
            break;
        }

        // Fetch suggested users
        const users = await getSuggestedUsers();

        setPosts(feedPosts);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Failed to fetch feed data:", err);
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [feedType, user]);

  if (loading) {
    return (
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading feed: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
      {/* Left sidebar - hidden on mobile and tablet */}
      <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
        <div className="flex flex-col gap-6">
          {user && <UserProfile user={user} />}
          <WritePostCTA todayWordCount={0} />
        </div>
      </div>

      {/* Main feed */}
      <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
        <div className="flex flex-col gap-6 md:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar - hidden on mobile, shown on tablet+ */}
      <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0">
        <WhoToFollow users={suggestedUsers} />
      </div>
    </div>
  );
}
