import Image from "next/image";
import { SuggestedUser } from "../types";
import UserProfile from "./UserProfile";

interface WhoToFollowProps {
  users: SuggestedUser[];
}

export default function WhoToFollow({ users }: WhoToFollowProps) {
  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <h3 className="text-stone-900 text-xl font-semibold">Who to follow</h3>

      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <UserProfile user={user} size="sm" />
            </div>

            <button className="px-3.5 py-1 bg-stone-900 rounded-full shadow-lg flex justify-center items-center transition-opacity hover:opacity-90">
              <span className="text-white text-xs font-semibold">Follow</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
