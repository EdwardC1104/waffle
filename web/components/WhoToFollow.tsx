import Image from "next/image";
import { SuggestedUser } from "../types";

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
              <Image
                src={user.avatar}
                alt={user.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-stone-900 text-xs font-medium">
                  {user.name}
                </p>
                <p className="text-zinc-600 text-xs font-normal">
                  @{user.username}
                </p>
              </div>
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
