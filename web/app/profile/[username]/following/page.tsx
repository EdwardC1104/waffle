"use client";

import UserFollowPage from "@/components/follow/UserFollowPage";
import useProfileUser from "@/hooks/useProfileUser";
import useUserFollowing from "@/hooks/useUserFollowing";
import { useParams } from "next/navigation";

export default function FollowingPage() {
  const username = useParams().username;
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useProfileUser(username);
  const {
    following,
    loading: followingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useUserFollowing(username);

  const isLoading = userLoading || followingLoading;
  const errorMessage = userError || followingError;

  const handleRetry = () => {
    refetchUser();
    refetchFollowing();
  };

  return (
    <UserFollowPage
      profileUser={user}
      users={following}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={handleRetry}
      followType="following"
    />
  );
}
