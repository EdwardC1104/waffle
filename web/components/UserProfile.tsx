import formatNumber from "@/utils/formatNumber";
import Link from "next/dist/client/link";
import Image from "next/image";
import { User } from "../types";
import { MoreIcon } from "./Icons";

interface UserProfileProps {
  user: User;
  containerClassName?: string;
  avatarSize?: number;
  avatarClassName?: string;
  nameTextClassName?: string;
  usernameTextClassName?: string;
  statsNumberClassName?: string;
  statsLabelClassName?: string;
  hideButton?: boolean;
}

export default function UserProfile({ 
  user,
  containerClassName = "",
  avatarSize = 48,
  avatarClassName = "w-12 h-12",
  nameTextClassName = "text-xs font-medium",
  usernameTextClassName = "text-xs font-normal",
  statsNumberClassName = "text-2xl font-bold",
  statsLabelClassName = "text-xs font-medium",
  hideButton = false
}: UserProfileProps) {
  
  return (
    <div className={`py-6 rounded-2xl flex flex-col gap-6 ${containerClassName}`}>
      <div className="flex justify-between items-center">
        <Link href="/profile/edward">
          <button className="flex items-center gap-3 text-left cursor-pointer">
            <Image
              src={user.avatar}
              alt={user.name}
              width={avatarSize}
              height={avatarSize}
              className={`${avatarClassName} rounded-full object-cover`}
            />
            <div>
              <p className={`text-stone-900 ${nameTextClassName}`}>{user.name}</p>
              <p className={`text-zinc-600 ${usernameTextClassName}`}>
                @{user.username}
              </p>
            </div>
          </button>
        </Link>
        {!hideButton && (
          <button className="p-1">
            <MoreIcon size={16} className="text-stone-900" />
          </button>
        )}
      </div>

      <div className="flex justify-center items-center">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className={`text-center text-stone-900 ${statsNumberClassName} font-serif`}>
            {formatNumber(user.wordCount)}
          </div>
          <div className={`text-center text-stone-900 ${statsLabelClassName}`}>
            Words
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className={`text-center text-stone-900 ${statsNumberClassName} font-serif`}>
            {formatNumber(user.followers)}
          </div>
          <div className={`text-center text-stone-900 ${statsLabelClassName}`}>
            Followers
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className={`text-center text-stone-900 ${statsNumberClassName} font-serif`}>
            {user.following}
          </div>
          <div className={`text-center text-stone-900 ${statsLabelClassName}`}>
            Following
          </div>
        </div>
      </div>
    </div>
  );
}
