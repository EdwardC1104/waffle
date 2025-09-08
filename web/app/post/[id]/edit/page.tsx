"use client";

import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";
import ErrorMessage from "@/components/general/ErrorMessage";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import DeleteSection from "@/components/post/DeleteSection";
import PostForm from "@/components/post/PostForm";
import useAuth from "@/hooks/useAuth";
import { useEditPost } from "@/hooks/useEditPost";
import { notFound } from "next/navigation";
import { use } from "react";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { user } = useAuth();
  const resolvedParams = use(params);

  const {
    post,
    loading,
    error,
    setError,
    isSubmitting,
    isDeleting,
    isUnauthorized,
    handleUpdatePost,
    handleDeletePost,
  } = useEditPost({
    postId: resolvedParams.id,
    username: user?.username,
  });

  if (!user) {
    return null;
  }

  if (isUnauthorized) {
    return notFound();
  }

  if (loading) {
    return <LoadingSpinner text="Loading post..." center />;
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <ErrorMessage
          title="Failed to Load Post"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <AuthenticatedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <PostForm
          initialTitle={post.title}
          initialContent={post.content}
          initialImage={post.coverImageUrl}
          onSubmit={handleUpdatePost}
          submitButtonText="Update"
          isSubmitting={isSubmitting}
          error={error}
          onErrorChange={setError}
          errorTitle="Failed to Update Post"
          headerTitle="Edit Post"
          backButtonText="Back to Post"
          backButtonUrl={`/post/${post.id}`}
        />

        <DeleteSection
          title="Delete Post"
          description="Once you delete this post, there is no going back. Please be certain."
          buttonText="Delete Post"
          onDelete={handleDeletePost}
          isDeleting={isDeleting}
        />
      </div>
    </AuthenticatedRoute>
  );
}
