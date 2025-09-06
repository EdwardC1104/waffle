import useAuth from "@/hooks/useAuth";
import formatNumber from "@/utils/formatNumber";
import Link from "next/dist/client/link";
import { useRouter } from "next/navigation";
import { User } from "../types";
import DropDown from "./DropDown";
import FollowButton from "./FollowButton";
import { EditIcon, LogoutIcon, SavedPostsIcon } from "./Icons";
import Names from "./User/Names";
import ProfilePicture from "./User/ProfilePicture";

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

  const isCurrentUser = currentUser?.id === user.id;

  const containerClass = {
    sm: "flex justify-between items-center",
    md: "py-6 rounded-2xl flex flex-col gap-6",
    lg: "py-8 px-8 rounded-2xl flex flex-col gap-12",
  }[size];

  const userSectionClass = {
    sm: "flex items-center gap-2.5  flex-1",
    md: "flex justify-between items-center",
    lg: "flex flex-col gap-4",
  }[size];

  const statsNumberClass = {
    sm: "text-2xl font-bold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
  }[size];

  const statsLabelClass = {
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
    <div className={`${containerClass} ${containerClassName}`}>
      <div className={userSectionClass}>
        {size === "lg" ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
            <div className="flex items-center gap-3 flex-1">
              <ProfilePicture
                url={user.profilePictureUrl}
                name={user.name}
                size={size}
              />
              <Names
                name={user.name}
                username={user.username}
                size={size}
                className="flex-1"
              />
              {isCurrentUser && (
                <div className="flex flex-shrink-0">
                  <DropDown iconSize={iconSize} items={dropdownItems} />
                </div>
              )}
            </div>
            {!isCurrentUser && (
              <div className="flex justify-center sm:justify-end">
                <FollowButton username={user.username} size="lg" />
              </div>
            )}
          </div>
        ) : size === "sm" ? (
          <Link href={`/profile/${user.username}`} className="flex-1">
            <button className="flex items-center gap-3 text-left cursor-pointer w-full">
              <ProfilePicture
                url={user.profilePictureUrl}
                name={user.name}
                size={size}
                className="flex-shrink-0"
              />
              <Names
                name={user.name}
                username={user.username}
                size={size}
                className="flex-1"
              />
            </button>
          </Link>
        ) : (
          <>
            <Link href={`/profile/${user.username}`}>
              <button className="flex items-center gap-3 text-left cursor-pointer">
                <ProfilePicture
                  url={user.profilePictureUrl}
                  name={user.name}
                  size={size}
                />
                <Names name={user.name} username={user.username} size={size} />
              </button>
            </Link>
            {isCurrentUser ? (
              <DropDown iconSize={iconSize} items={dropdownItems} />
            ) : (
              <FollowButton username={user.username} size="sm" />
            )}
          </>
        )}
      </div>

      {showStats && (
        <div className="flex justify-center items-center">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`text-center text-stone-900 ${statsNumberClass} font-serif`}
            >
              {formatNumber(user.wordCount)}
            </div>
            <div className={`text-center text-stone-900 ${statsLabelClass}`}>
              Words
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <Link href={`/profile/${user.username}/followers`}>
              <button className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div
                  className={`text-center text-stone-900 ${statsNumberClass} font-serif`}
                >
                  {formatNumber(user.followerCount)}
                </div>
                <div
                  className={`text-center text-stone-900 ${statsLabelClass}`}
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
                  className={`text-center text-stone-900 ${statsNumberClass} font-serif`}
                >
                  {user.followingCount}
                </div>
                <div
                  className={`text-center text-stone-900 ${statsLabelClass}`}
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
