"use client";

import useAuth from "@/hooks/useAuth";
import { follow, unfollow } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowButtonProps {
  username: string;
  className?: string;
  size?: "sm" | "lg";
  initialFollowState?: boolean;
}

/** Follow/Unfollow button component with 2 sizes. */
export default function FollowButton({
  username,
  className = "",
  size = "sm",
  initialFollowState = false,
}: FollowButtonProps) {
  const router = useRouter();
  const { user: currentUser, refetchUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowState);
  }, [initialFollowState]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      const desiredPath = `/profile/${username}`;
      const redirectUrl = `/login?redirect=${encodeURIComponent(desiredPath)}`;
      router.push(redirectUrl);
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        setIsFollowing(false);
        await unfollow(currentUser.username, username);
      } else {
        setIsFollowing(true);
        await follow(currentUser.username, username);
      }
      refetchUser();
    } catch (error) {
      console.error("Error toggling follow state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paddingClass = {
    sm: "px-3.5 py-1",
    lg: "px-10.5 py-3",
  }[size];

  const textClass = {
    sm: "text-xs font-semibold",
    lg: "text-lg font-semibold",
  }[size];

  const backgroundClass = isFollowing ? "bg-gray-200" : "bg-stone-900";
  const textColorClass = isFollowing ? "text-stone-900" : "text-white";

  if (currentUser?.username === username) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`
        ${paddingClass}
        rounded-full shadow-lg flex justify-center items-center 
        transition-all hover:opacity-90 disabled:opacity-50
        ${backgroundClass}
        ${className}
      `}
    >
      <span className={`${textClass} ${textColorClass}`}>
        {isFollowing ? "Following" : "Follow"}
      </span>
    </button>
  );
}
