"use client";

import {
  currentUser,
  mockPosts,
  suggestedUsers,
  todayWordCount,
} from "../data/mockData";
import PostCard from "./PostCard";
import UserProfile from "./UserProfile";
import WhoToFollow from "./WhoToFollow";
import WritePostCTA from "./WritePostCTA";

interface FeedProps {
  feedType?: "fyp" | "following" | "popular";
}

export default function Feed({ feedType = "fyp" }: FeedProps) {
  const posts = mockPosts;

  return (
    <div className="max-w-[1476px] mx-auto flex justify-center items-start gap-16">
      <div className="w-60 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <UserProfile user={currentUser} />
          <WritePostCTA todayWordCount={todayWordCount} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="w-[600px] flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="w-60 flex flex-col gap-8">
        <WhoToFollow users={suggestedUsers} />
      </div>
    </div>
  );
}
