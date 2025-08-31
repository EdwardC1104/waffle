import formatNumber from "@/utils/formatNumber";
import Link from "next/dist/client/link";
import Image from "next/image";
import { User } from "../types";
import { MoreIcon } from "./Icons";
import useAuth from "@/hooks/useAuth";



interface UserProfileProps {
  user: User;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
  hideButton?: boolean;
  showFollowButton?: boolean;
}

export default function UserProfile({
  user,
  size = "md",
  containerClassName = "",
}: UserProfileProps) {
  const { user: currentUser } = useAuth();
  
  // Check if the displayed user is the current logged-in user
  const isCurrentUser = currentUser && user.id === currentUser.id;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "flex justify-between items-center",
      userSection: "flex items-center gap-2.5",
      avatar: "w-9 h-9",
      avatarSize: 36,
      nameText: "text-xs font-medium",
      usernameText: "text-xs font-normal",
      statsNumber: "text-2xl font-bold", // Not used but needed for type consistency
      statsLabel: "text-xs font-medium", // Not used but needed for type consistency
      showStats: false,
      padding: "py-4",
    },
    md: {
      container: "py-6 rounded-2xl flex flex-col gap-6",
      userSection: "flex justify-between items-center",
      avatar: "w-12 h-12",
      avatarSize: 48,
      nameText: "text-xs font-medium",
      usernameText: "text-xs font-normal",
      statsNumber: "text-2xl font-bold",
      statsLabel: "text-xs font-medium",
      showStats: true,
      padding: "py-6",
    },
    lg: {
      container: "py-8 px-8 rounded-2xl flex flex-col gap-12",
      userSection: "flex justify-between items-center",
      avatar: "w-20 h-20",
      avatarSize: 80,
      nameText: "text-2xl font-bold",
      usernameText: "text-lg font-normal",
      statsNumber: "text-4xl font-bold",
      statsLabel: "text-base font-medium",
      showStats: true,
      padding: "py-16",
    },
  };

  const config = sizeConfig[size];

  // Small size layout (like WhoToFollow)
  if (size === "sm") {
    return (
      <div className={`${config.container} ${containerClassName}`}>
        <div className={config.userSection}>
          <Link href={`/profile/${user.username}`}>
            <button className="flex items-center gap-3 text-left cursor-pointer">
              <Image
                src={user.profilePictureUrl}
                alt={user.name}
                width={config.avatarSize}
                height={config.avatarSize}
                className={`${config.avatar} rounded-full object-cover`}
              />
              <div>
                <p className={`text-stone-900 ${config.nameText}`}>
                  {user.name}
                </p>
                <p className={`text-zinc-600 ${config.usernameText}`}>
                  @{user.username}
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Medium size layout
  if (size === "md") {
    return (
      <div className={`${config.container} ${containerClassName}`}>
        <div className={config.userSection}>
          <Link href={`/profile/${user.username}`}>
            <button className="flex items-center gap-3 text-left cursor-pointer">
              <Image
                src={user.profilePictureUrl}
                alt={user.name}
                width={config.avatarSize}
                height={config.avatarSize}
                className={`${config.avatar} rounded-full object-cover`}
              />
              <div>
                <p className={`text-stone-900 ${config.nameText}`}>
                  {user.name}
                </p>
                <p className={`text-zinc-600 ${config.usernameText}`}>
                  @{user.username}
                </p>
              </div>
            </button>
          </Link>
          <button className="p-1">
            <MoreIcon size={16} className="text-stone-900" />
          </button>
        </div>

        {config.showStats && (
          <div className="flex justify-center items-center">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(0)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Words
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(0)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Followers
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {0}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Following
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Large size layout
  else {
    return (
      <div className={`${config.container} ${containerClassName}`}>
        <div className={config.userSection}>
          <div className="flex items-center gap-3">
            <Image
              src={user.profilePictureUrl}
              alt={user.name}
              width={config.avatarSize}
              height={config.avatarSize}
              className={`${config.avatar} rounded-full object-cover`}
            />
            <div>
              <p className={`text-stone-900 ${config.nameText}`}>{user.name}</p>
              <p className={`text-zinc-600 ${config.usernameText}`}>
                @{user.username}
              </p>
            </div>
          </div>
          <button className="p-1">
            <MoreIcon size={32} className="text-stone-900" />
          </button>
        </div>

        {config.showStats && (
          <div className="flex justify-center items-center">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(0)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Words
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(0)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Followers
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {0}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Following
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}
