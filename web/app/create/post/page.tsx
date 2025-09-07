"use client";

import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";
import PostForm from "@/components/post/PostForm";
import useAuth from "@/hooks/useAuth";
import { useCreatePost } from "@/hooks/useCreatePost";

export default function CreatePostPage() {
  const { user } = useAuth();
  const { error, setError, isSubmitting, handleCreatePost } = useCreatePost({
    username: user?.username,
  });

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedRoute>
      <div className="max-w-4xl px-4 py-8 flex-1 w-full">
        <PostForm
          onSubmit={handleCreatePost}
          submitButtonText="Publish"
          isSubmitting={isSubmitting}
          error={error}
          onErrorChange={setError}
          errorTitle="Failed to Create Post"
        />
      </div>
    </AuthenticatedRoute>
  );
}
