import useAuth from "@/hooks/useAuth";
import formatNumber from "@/utils/formatNumber";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "../types";
import DropDown from "./DropDown";
import FollowButton from "./FollowButton";
import { EditIcon, LogoutIcon, SavedPostsIcon } from "./Icons";

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
  const router = useRouter();
  const { user: currentUser, logout } = useAuth();
  
  // Check for currentUser
  const isCurrentUser = currentUser?.id === user.id;

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
      iconSize: 16, // Not used but needed for type consistency
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
      iconSize: 16,
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
      iconSize: 24,
      showStats: true,
      padding: "py-16",
    },
  };

  const config = sizeConfig[size];

  // Dropdown items for current user
  const dropdownItems = isCurrentUser ? [
    {
      label: 'Saved posts',
      onClick: () => router.push('/feed/popular'),  // Temporary
      icon: <SavedPostsIcon size={16} />
    },
    {
      label: 'Edit Profile',
      onClick: () => router.push('/profile/edit'),
      icon: <EditIcon size={16} />
    },
    {
      label: 'Logout',
      onClick: async () => {
        try {
          await logout();
          router.push('/login');
        } catch (error) {
          console.error('Failed to logout:', error);
        }
      },
      icon: <LogoutIcon size={16} />
    }
  ] : [];

  // Small size layout (like WhoToFollow)
  if (size === "sm") {
    return (
      <div className={`${config.container} ${containerClassName}`}>
        <div className={`${config.userSection} min-w-0 flex-1`}>
          <Link href={`/profile/${user.username}`} className="min-w-0 flex-1">
            <button className="flex items-center gap-3 text-left cursor-pointer min-w-0 w-full">
              <Image
                src={!user.profilePictureUrl ?  '/Chicken.jpeg' : user.profilePictureUrl}
                alt={user.name}
                width={config.avatarSize}
                height={config.avatarSize}
                className={`${config.avatar} rounded-full object-cover flex-shrink-0`}
              />
              <div className="min-w-0 flex-1">
                <p className={`text-stone-900 ${config.nameText}`}>
                  {user.name}
                </p>
                <p className={`text-zinc-600 ${config.usernameText} truncate`}>
                  @{user.username}
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    );
  }  // Medium size layout
  if (size === "md") {
    return (
      <div className={`${config.container} ${containerClassName}`}>
        <div className={config.userSection}>
          <Link href={`/profile/${user.username}`}>
            <button className="flex items-center gap-3 text-left cursor-pointer">
              <Image
                src={!user.profilePictureUrl ?  '/Chicken.jpeg' : user.profilePictureUrl}
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
          <DropDown
            userId={user.id}
            showForCurrentUserOnly={true}
            iconSize={config.iconSize}
            items={dropdownItems}
          />
        </div>

        {config.showStats && (
          <div className="flex justify-center items-center">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(user.wordCount)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Words
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <Link href={`/profile/${user.username}/followers`}>
                <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div
                    className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
                  >
                    {formatNumber(user.followerCount)}
                  </div>
                  <div
                    className={`text-center text-stone-900 ${config.statsLabel}`}
                  >
                    Followers
                  </div>
                </button>
              </Link>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <Link href={`/profile/${user.username}/following`}>
                <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div
                    className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
                  >
                    {user.followingCount}
                  </div>
                  <div
                    className={`text-center text-stone-900 ${config.statsLabel}`}
                  >
                    Following
                  </div>
                </button>
              </Link>
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={!user.profilePictureUrl ?  '/Chicken.jpeg' : user.profilePictureUrl}
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
            
            {!isCurrentUser ? (
              <div className="flex justify-center sm:justify-end">
                <FollowButton username={user.username} size="lg" />
              </div>
            ) : (
              <div className="flex justify-center sm:justify-end">
                <DropDown
                  userId={user.id}
                  showForCurrentUserOnly={true}
                  iconSize={config.iconSize}
                  items={dropdownItems}
                />
              </div>
            )}
          </div>
        </div>

        {config.showStats && (
          <div className="flex justify-center items-center">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
              >
                {formatNumber(user.wordCount)}
              </div>
              <div
                className={`text-center text-stone-900 ${config.statsLabel}`}
              >
                Words
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <Link href={`/profile/${user.username}/followers`}>
                <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div
                    className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
                  >
                    {formatNumber(user.followerCount)}
                  </div>
                  <div
                    className={`text-center text-stone-900 ${config.statsLabel}`}
                  >
                    Followers
                  </div>
                </button>
              </Link>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <Link href={`/profile/${user.username}/following`}>
                <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div
                    className={`text-center text-stone-900 ${config.statsNumber} font-serif`}
                  >
                    {user.followingCount}
                  </div>
                  <div
                    className={`text-center text-stone-900 ${config.statsLabel}`}
                  >
                    Following
                  </div>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
