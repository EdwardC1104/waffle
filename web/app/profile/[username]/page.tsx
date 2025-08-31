"use client";

import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostCard from "@/components/PostCard";
import UserProfile from "@/components/UserProfile";
import WhoToFollow from "@/components/WhoToFollow";
import WritePostCTA from "@/components/WritePostCTA";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";

export default function UserProfilePage() {
  const { user, posts, loading, error, refetch, handlePostUpdate } = useProfile();
  const { user: currentUser } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading profile..." fullPage center />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen">
        <div className="w-full max-w-[1476px] mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
          <ErrorMessage
            title={error ? "Failed to load profile" : "User not found"}
            message={
              error ||
              "The user could not be found."
            }
            onRetry={refetch}
            showRetryButton={!!error}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
        <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
          <WritePostCTA todayWordCount={0} />
        </div>

        <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
          <div className="bg-white shadow rounded-lg">
            <UserProfile user={user} size="lg" />
            <div className="px-6 pb-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-600">
                  {currentUser && user.username === currentUser.username
                    ? "This is your profile."
                    : `Welcome to ${user.name || user.username}'s profile!`}
                </p>
              </div>
            </div>
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

        <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0">
          <WhoToFollow />
        </div>
      </div>
    </div>
  );
}
