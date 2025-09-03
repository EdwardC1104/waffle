"use client";

import BackButton from "@/components/BackButton";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserListComponent from "@/components/UserListComponent";
import { User } from "@/types";
import Link from "next/link";

interface FollowLayoutProps {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  type: "followers" | "following";
}

export default function FollowLayout({
  user,
  users,
  loading,
  error,
  onRetry,
  type,
}: FollowLayoutProps) {
  if (loading) {
    return <LoadingSpinner text={`Loading ${type}...`} center />;
  }

  if (error || !user) {
    return (
      <div className="flex-1 w-full">
        <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
          <ErrorMessage
            title={error ? `Failed to load ${type}` : "User not found"}
            message={error || "The user could not be found."}
            onRetry={onRetry}
            showRetryButton={!!error}
          />
        </div>
      </div>
    );
  }

  const isFollowers = type === "followers";
  const count = users.length;
  const countText = isFollowers
    ? `${count} ${count === 1 ? "follower" : "followers"}`
    : `${count} following`;

  return (
    <div className="flex-1 w-full">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[600px]">
          <div className="mb-6">
            <BackButton className="mb-4" goTo={`/profile/${user.username}`} />
            <h1 className="text-2xl font-bold text-stone-900 font-serif">
              {user.name}&apos;s {isFollowers ? "Followers" : "Following"}
            </h1>
            <p className="text-zinc-600 mt-1">{countText}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <Link
              href={`/profile/${user.username}/followers`}
              className={`flex-1 px-4 py-2 rounded-full text-center text-sm font-semibold transition-colors ${
                isFollowers
                  ? "bg-stone-900 text-white"
                  : "bg-transparent text-stone-900 hover:bg-stone-100"
              }`}
            >
              Followers
            </Link>
            <Link
              href={`/profile/${user.username}/following`}
              className={`flex-1 px-4 py-2 rounded-full text-center text-sm font-semibold transition-colors ${
                !isFollowers
                  ? "bg-stone-900 text-white"
                  : "bg-transparent text-stone-900 hover:bg-stone-100"
              }`}
            >
              Following
            </Link>
          </div>

          <UserListComponent
            users={users}
            emptyMessage={
              isFollowers ? "No followers yet." : "Not following anyone yet."
            }
          />
        </div>
      </div>
    </div>
  );
}
