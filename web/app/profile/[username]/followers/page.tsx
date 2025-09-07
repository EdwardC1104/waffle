"use client";

import UserFollowPage from "@/components/follow/UserFollowPage";
import useProfileUser from "@/hooks/useProfileUser";
import useUserFollowers from "@/hooks/useUserFollowers";
import { useParams } from "next/navigation";

export default function FollowersPage() {
  const username = useParams().username;
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useProfileUser(username);
  const {
    followers,
    loading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useUserFollowers(username);

  const isLoading = userLoading || followersLoading;
  const errorMessage = userError || followersError;

  const handleRetry = () => {
    refetchUser();
    refetchFollowers();
  };

  return (
    <UserFollowPage
      profileUser={user}
      users={followers}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={handleRetry}
      followType="followers"
    />
  );
}
