"use client";

import PostCard from "@/components/feed/PostCard";
import ErrorMessage from "@/components/general/ErrorMessage";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import UserProfile from "@/components/user/UserProfile";
import WhoToFollow from "@/components/widgets/WhoToFollow";
import WritePost from "@/components/widgets/WritePost";
import useAuth from "@/hooks/useAuth";
import useProfileUser from "@/hooks/useProfileUser";
import useUserPosts from "@/hooks/useUserPosts";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const username = useParams().username;
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useProfileUser(username);
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
    handlePostUpdate,
  } = useUserPosts(username);
  const { user: currentUser } = useAuth();

  const loading = userLoading || postsLoading;
  const error = userError || postsError;

  const refetch = () => {
    refetchUser();
    refetchPosts();
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." center />;
  }

  if (error || !user) {
    return (
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage
          title={error ? "Failed to load profile" : "User not found"}
          message={error || "The user could not be found."}
          onRetry={refetch}
          showRetryButton={!!error}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
      <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0 sticky top-16">
        {currentUser && currentUser.id !== user.id && (
          <UserProfile user={currentUser} />
        )}
        <WritePost />
      </div>

      <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
        <div className="bg-white shadow rounded-lg">
          <UserProfile user={user} size="lg" />
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0 sticky top-16">
        <WhoToFollow />
      </div>
    </div>
  );
}
