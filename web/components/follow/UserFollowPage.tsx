"use client";

import FollowTabs from "@/components/follow/FollowTabs";
import UserListComponent from "@/components/follow/UserListComponent";
import BackButton from "@/components/general/BackButton";
import ErrorMessage from "@/components/general/ErrorMessage";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { User } from "@/types";

type FollowType = "followers" | "following";

interface UserFollowPageProps {
  profileUser: User | null;
  users: User[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  followType: FollowType;
}

/** Shows a user's list of followers or who they're following. */
export default function UserFollowPage({
  profileUser,
  users,
  isLoading,
  errorMessage,
  onRetry,
  followType,
}: UserFollowPageProps) {
  if (isLoading) {
    return <LoadingSpinner text={`Loading ${followType}...`} center />;
  }

  if (errorMessage || !profileUser) {
    return (
      <div className="flex-1 w-full">
        <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
          <ErrorMessage
            title={
              errorMessage ? `Failed to load ${followType}` : "User not found"
            }
            message={errorMessage || "The user could not be found."}
            onRetry={onRetry}
            showRetryButton={!!errorMessage}
          />
        </div>
      </div>
    );
  }

  const isFollowers = followType === "followers";
  const count = users.length;
  const countText = isFollowers
    ? `${count} ${count === 1 ? "follower" : "followers"}`
    : `${count} following`;
  const pageTitle = `${profileUser.name}'s ${
    isFollowers ? "Followers" : "Following"
  }`;
  const emptyMessage = isFollowers
    ? "No followers yet."
    : "Not following anyone yet.";

  return (
    <div className="flex-1 w-full">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[600px]">
          <div className="mb-6">
            <BackButton
              className="mb-4"
              goTo={`/profile/${profileUser.username}`}
            />
            <h1 className="text-2xl font-bold text-stone-900 font-serif">
              {pageTitle}
            </h1>
            <p className="text-zinc-600 mt-1">{countText}</p>
          </div>

          <FollowTabs username={profileUser.username} activeTab={followType} />

          <UserListComponent users={users} emptyMessage={emptyMessage} />
        </div>
      </div>
    </div>
  );
}
