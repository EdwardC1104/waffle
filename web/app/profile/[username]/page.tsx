"use client";

import PostCard from "@/components/PostCard";
import UserProfile from "@/components/UserProfile";
import WhoToFollow from "@/components/WhoToFollow";
import WritePostCTA from "@/components/WritePostCTA";
import useAuth from "@/hooks/useAuth";
import { Post, User } from "@/types";
import {
  getSuggestedUsers,
  getUserByUsername,
  getUserPosts,
} from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const username = useParams().username;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || typeof username !== "string") {
        setUser(currentUser);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user details and posts in parallel
        const [userData, userPosts, users] = await Promise.all([
          getUserByUsername(username),
          getUserPosts(username),
          getSuggestedUsers(username),
        ]);

        setUser(userData);
        setPosts(userPosts);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
        // Fallback to current user if API fails
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">User not found</p>
            {error && <p className="text-gray-600 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
        {/* Left sidebar - hidden on mobile and tablet */}
        <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
          <WritePostCTA todayWordCount={0} />
        </div>

        {/* Main content - Profile and Posts */}
        <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <UserProfile user={user} size="lg" />
            <div className="px-6 pb-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-600">
                  {user.username === user.username
                    ? "This is your profile."
                    : `Welcome to ${user.name}'s profile!`}
                </p>
              </div>
            </div>
          </div>

          {/* Posts Section */}
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
    </div>
  );
}
