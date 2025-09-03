"use client";

import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostCard from "@/components/PostCard";
import UserProfile from "@/components/UserProfile";
import WhoToFollow from "@/components/WhoToFollow";
import WritePostCTA from "@/components/WritePostCTA";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";
import useTodayWordCount from "@/hooks/useTodayWordCount";

export default function UserProfilePage() {
  const { user, posts, loading, error, refetch, handlePostUpdate } =
    useProfile("posts");
  const { user: currentUser } = useAuth();
  const { todayWordCount } = useTodayWordCount();

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
        <WritePostCTA todayWordCount={todayWordCount} />
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
