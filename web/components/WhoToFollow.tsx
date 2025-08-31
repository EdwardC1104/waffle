import useAuth from "@/hooks/useAuth";
import { fetchFollowSuggestions } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types";
import FollowButton from "./FollowButton";
import UserProfile from "./UserProfile";

export default function WhoToFollow() {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  const fetchSuggestedUsers = useCallback(async () => {
    if (currentUser) {
      try {
        const users = await fetchFollowSuggestions(currentUser.username);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Failed to fetch suggested users:", err);
        setSuggestedUsers([]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <h3 className="text-stone-900 text-xl font-semibold">Who to follow</h3>

      <div className="flex flex-col gap-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <UserProfile user={user} size="sm" />
            </div>

            <FollowButton username={user.username} />
          </div>
        ))}
      </div>
    </div>
  );
}
