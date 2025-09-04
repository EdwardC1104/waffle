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

  // Dynamic classes based on size
  const containerClasses = {
    sm: "flex justify-between items-center",
    md: "py-6 rounded-2xl flex flex-col gap-6",
    lg: "py-8 px-8 rounded-2xl flex flex-col gap-12",
  }[size];

  const userSectionClasses = {
    sm: "flex items-center gap-2.5 min-w-0 flex-1",
    md: "flex justify-between items-center",
    lg: "flex flex-col gap-4",
  }[size];

  const avatarClasses = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }[size];

  const avatarSize = {
    sm: 36,
    md: 48,
    lg: 80,
  }[size];

  const nameClasses = {
    sm: "text-xs font-medium",
    md: "text-xs font-medium",
    lg: "text-2xl font-bold",
  }[size];

  const usernameClasses = {
    sm: "text-xs font-normal",
    md: "text-xs font-normal",
    lg: "text-lg font-normal",
  }[size];

  const statsNumberClasses = {
    sm: "text-2xl font-bold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
  }[size];

  const statsLabelClasses = {
    sm: "text-xs font-medium",
    md: "text-xs font-medium",
    lg: "text-base font-medium",
  }[size];

  const iconSize = {
    sm: 16,
    md: 16,
    lg: 24,
  }[size];

  const showStats = size !== "sm";

  // Dropdown items for current user
  const dropdownItems = isCurrentUser
    ? [
        {
          label: "Saved posts",
          onClick: () => router.push("/feed/popular"), // Temporary
          icon: <SavedPostsIcon size={16} />,
        },
        {
          label: "Edit Profile",
          onClick: () => router.push("/profile/edit"),
          icon: <EditIcon size={16} />,
        },
        {
          label: "Logout",
          onClick: async () => {
            try {
              await logout();
              router.push("/login");
            } catch (error) {
              console.error("Failed to logout:", error);
            }
          },
          icon: <LogoutIcon size={16} />,
        },
      ]
    : [];

  return (
    <div className={`${containerClasses} ${containerClassName}`}>
      <div className={userSectionClasses}>
        {size === "lg" ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Image
                src={
                  !user.profilePictureUrl
                    ? "/Chicken.jpeg"
                    : user.profilePictureUrl
                }
                alt={user.name}
                width={avatarSize}
                height={avatarSize}
                className={`${avatarClasses} rounded-full object-cover`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-stone-900 ${nameClasses}`}>{user.name}</p>
                <p className={`text-zinc-600 ${usernameClasses}`}>
                  @{user.username}
                </p>
              </div>
              {currentUser && (
                <div className="flex flex-shrink-0">
                  <DropDown
                    userId={user.id}
                    showForCurrentUserOnly={true}
                    iconSize={iconSize}
                    items={dropdownItems}
                  />
                </div>
              )}
            </div>

            {!isCurrentUser && (
              <div className="flex justify-center sm:justify-end">
                <FollowButton username={user.username} size="lg" />
              </div>
            )}
          </div>
        ) : (
          <>
            {size === "sm" ? (
              <Link
                href={`/profile/${user.username}`}
                className="min-w-0 flex-1"
              >
                <button className="flex items-center gap-3 text-left cursor-pointer min-w-0 w-full">
                  <Image
                    src={
                      !user.profilePictureUrl
                        ? "/Chicken.jpeg"
                        : user.profilePictureUrl
                    }
                    alt={user.name}
                    width={avatarSize}
                    height={avatarSize}
                    className={`${avatarClasses} rounded-full object-cover flex-shrink-0`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-stone-900 ${nameClasses}`}>
                      {user.name}
                    </p>
                    <p className={`text-zinc-600 ${usernameClasses} truncate`}>
                      @{user.username}
                    </p>
                  </div>
                </button>
              </Link>
            ) : (
              <>
                <Link href={`/profile/${user.username}`}>
                  <button className="flex items-center gap-3 text-left cursor-pointer">
                    <Image
                      src={
                        !user.profilePictureUrl
                          ? "/Chicken.jpeg"
                          : user.profilePictureUrl
                      }
                      alt={user.name}
                      width={avatarSize}
                      height={avatarSize}
                      className={`${avatarClasses} rounded-full object-cover`}
                    />
                    <div>
                      <p className={`text-stone-900 ${nameClasses}`}>
                        {user.name}
                      </p>
                      <p className={`text-zinc-600 ${usernameClasses}`}>
                        @{user.username}
                      </p>
                    </div>
                  </button>
                </Link>
                <DropDown
                  userId={user.id}
                  showForCurrentUserOnly={true}
                  iconSize={iconSize}
                  items={dropdownItems}
                />
              </>
            )}
          </>
        )}
      </div>

      {showStats && (
        <div className="flex justify-center items-center">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`text-center text-stone-900 ${statsNumberClasses} font-serif`}
            >
              {formatNumber(user.wordCount)}
            </div>
            <div className={`text-center text-stone-900 ${statsLabelClasses}`}>
              Words
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <Link href={`/profile/${user.username}/followers`}>
              <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div
                  className={`text-center text-stone-900 ${statsNumberClasses} font-serif`}
                >
                  {formatNumber(user.followerCount)}
                </div>
                <div
                  className={`text-center text-stone-900 ${statsLabelClasses}`}
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
                  className={`text-center text-stone-900 ${statsNumberClasses} font-serif`}
                >
                  {user.followingCount}
                </div>
                <div
                  className={`text-center text-stone-900 ${statsLabelClasses}`}
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
