"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";

interface FollowButtonProps {
  userId: string;
  initialFollowState?: boolean;
  className?: string;
  size?: "sm" | "lg";
}

export default function FollowButton({
  userId,
  initialFollowState = false,
  className = "",
  size = "sm",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);

  const toggleFollowState = () => {
    setIsFollowing(!isFollowing);
  };

  // Size configurations to match UserProfile scaling
  const sizeConfig = {
    sm: {
      padding: "px-3.5 py-1",
      fontSize: "text-xs font-semibold",
    },
    lg: {
      padding: "px-8 py-3",
      fontSize: "text-lg font-semibold",
    },
  };

  const config = sizeConfig[size];

  return (
    <button 
      onClick={toggleFollowState}
      className={`${config.padding} rounded-full shadow-lg flex justify-center items-center transition-all hover:opacity-90 ${
        isFollowing 
          ? 'bg-gray-200 border border-stone-900' 
          : 'bg-stone-900'
      } ${className}`}
    >
      <span className={`${config.fontSize} ${
        isFollowing 
          ? 'text-stone-900' 
          : 'text-white'
      }`}>
        {isFollowing ? 'Following' : 'Follow'}
      </span>
    </button>
  );
}
