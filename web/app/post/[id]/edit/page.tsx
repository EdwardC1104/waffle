"use client";

import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostForm from "@/components/PostForm";
import { Post } from "@/types";
import { deletePost, fetchPost, updatePost } from "@/utils/api";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <AuthenticatedRoute>
      {(user) => <EditPostContent user={user} params={params} />}
    </AuthenticatedRoute>
  );
}

function EditPostContent({
  user,
  params,
}: {
  user: { username: string };
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await fetchPost(parseInt(resolvedParams.id));

        // Check if user owns this post
        if (postData.author.username !== user.username) {
          notFound();
          return;
        }

        setPost(postData);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [resolvedParams.id, user.username]);

  const handleUpdatePost = async (
    title: string,
    content: string,
    imageUrl?: string
  ) => {
    if (!post) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await updatePost(post.id, title, content, imageUrl);
      router.replace(`/post/${post.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deletePost(post.id);
      router.push(`/profile/${user.username}`);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading post..." center />;
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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
    <div className="max-w-4xl mx-auto px-4 py-8">
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

      {/* Delete Post Section */}
      <div className="mt-12 pt-8 border-t border-zinc-200">
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Delete Post
          </h3>
          <p className="text-red-700 mb-4">
            Once you delete this post, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeletePost}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
