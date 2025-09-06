"use client";

import Names from "@/components/user/Names";
import ProfilePicture from "@/components/user/ProfilePicture";
import { User } from "@/types";
import Link from "next/link";

interface UserResultProps {
  user: User;
  onResultClick: () => void;
}

/** Displays a single user result in the search results. */
export default function UserResult({ user, onResultClick }: UserResultProps) {
  return (
    <Link
      href={`/profile/${user.username}`}
      onClick={onResultClick}
      className="flex items-center px-4 py-3 border-b hover:bg-gray-50 border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="mr-3">
        <ProfilePicture
          url={user.profilePictureUrl}
          name={user.name}
          size="sm"
        />
      </div>
      <div className="flex-1">
        <Names name={user.name} username={user.username} size="md" />
      </div>
      <div className="text-sm text-[#1C1C19]/50">
        {user.followerCount} followers
      </div>
    </Link>
  );
}
