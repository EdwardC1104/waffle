import formatNumber from "@/utils/formatNumber";
import Link from "next/dist/client/link";
import Image from "next/image";
import { User } from "../types";
import { MoreIcon } from "./Icons";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Link href="/profile/edward">
          <button className="flex items-center gap-3 text-left cursor-pointer">
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-stone-900 text-xs font-medium">{user.name}</p>
              <p className="text-zinc-600 text-xs font-normal">
                @{user.username}
              </p>
            </div>
          </button>
        </Link>
        <button className="p-1">
          <MoreIcon size={16} className="text-stone-900" />
        </button>
      </div>

      <div className="flex justify-center items-center">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="text-center text-stone-900 text-2xl font-bold font-serif">
            {formatNumber(user.wordCount)}
          </div>
          <div className="text-center text-stone-900 text-xs font-medium">
            Words
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="text-center text-stone-900 text-2xl font-bold font-serif">
            {formatNumber(user.followers)}
          </div>
          <div className="text-center text-stone-900 text-xs font-medium">
            Followers
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="text-center text-stone-900 text-2xl font-bold font-serif">
            {user.following}
          </div>
          <div className="text-center text-stone-900 text-xs font-medium">
            Following
          </div>
        </div>
      </div>
    </div>
  );
}
