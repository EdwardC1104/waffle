"use client";

import useAuth from "@/hooks/useAuth";
import { fetchFollowing, follow, unfollow } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowButtonProps {
  username: string;
  className?: string;
  size?: "sm" | "lg";
}

export default function FollowButton({
  username,
  className = "",
  size = "sm",
}: FollowButtonProps) {
  const router = useRouter();
  const { user: currentUser, refetchUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const following = await fetchFollowing(currentUser.username);
        const isCurrentlyFollowing = following.some(
          (user) => user.username === username
        );
        setIsFollowing(isCurrentlyFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [currentUser, username]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    try {
      if (isFollowing) {
        await unfollow(currentUser.username, username);
      } else {
        await follow(currentUser.username, username);
      }
      setIsFollowing(!isFollowing);
      refetchUser();
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  const sizeConfig = {
    sm: {
      padding: "px-3.5 py-1",
      fontSize: "text-xs font-semibold",
    },
    lg: {
      padding: "px-10.5 py-3",
      fontSize: "text-lg font-semibold",
    },
  };

  const config = sizeConfig[size];

  if (currentUser?.username === username) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`${
        config.padding
      } rounded-full shadow-lg flex justify-center items-center transition-all hover:opacity-90 disabled:opacity-50 ${
        isFollowing ? "bg-gray-200 border border-stone-900" : "bg-stone-900"
      } ${className}`}
    >
      <span
        className={`${config.fontSize} ${
          isFollowing ? "text-stone-900" : "text-white"
        }`}
      >
        {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
      </span>
    </button>
  );
}
