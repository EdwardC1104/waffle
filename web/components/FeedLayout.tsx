"use client";

import { useEffect, useState } from "react";
import { User } from "../types";
import { fetchFollowSuggestions } from "../utils/api";
import Feed from "./Feed";
import UserProfile from "./UserProfile";
import WhoToFollow from "./WhoToFollow";
import WritePostCTA from "./WritePostCTA";

interface FeedLayoutProps {
  feedType: "fyp" | "following" | "popular";
  user?: User; // Optional for popular feed
}

export default function FeedLayout({ feedType, user }: FeedLayoutProps) {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (user) {
        try {
          const suggested = await fetchFollowSuggestions(user.username);
          setSuggestedUsers(suggested);
        } catch (err) {
          console.warn("Could not fetch suggested users:", err);
        }
      } else {
        setSuggestedUsers([]);
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  return (
    <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
      <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
        <div className="flex flex-col gap-6">
          {user && <UserProfile user={user} />}
          <WritePostCTA todayWordCount={0} />
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
        <Feed feedType={feedType} username={user?.username} />
      </div>

      <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0">
        {suggestedUsers.length > 0 && <WhoToFollow />}
      </div>
    </div>
  );
}
