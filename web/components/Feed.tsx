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
    <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
      {/* Left sidebar - hidden on mobile and tablet */}
      <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
        <div className="flex flex-col gap-6">
          <UserProfile user={currentUser} />
          <WritePostCTA todayWordCount={todayWordCount} />
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

