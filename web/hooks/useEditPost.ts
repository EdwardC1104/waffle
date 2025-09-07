import { Post } from "@/types";
import { deletePost, fetchPost, updatePost } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseEditPostOptions {
  postId: string;
  username?: string;
}

interface UseEditPostReturn {
  post: Post | null;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  isUnauthorized: boolean;
  setError: (error: string | null) => void;
  handleUpdatePost: (
    title: string,
    content: string,
    coverImage?: File
  ) => Promise<void>;
  handleDeletePost: () => Promise<void>;
}

/** Hook to manage editing and deleting a post. */
export function useEditPost({
  postId,
  username,
}: UseEditPostOptions): UseEditPostReturn {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsUnauthorized(false);

        const postData = await fetchPost(parseInt(postId));

        // Check if user owns this post
        if (postData.author.username !== username) {
          setIsUnauthorized(true);
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

    loadPost();
  }, [postId, username]);

  const handleUpdatePost = useCallback(
    async (title: string, content: string, coverImage?: File) => {
      if (!post || isSubmitting) return;

      setError(null);
      setIsSubmitting(true);

      try {
        await updatePost(post.id, title, content, coverImage);
        router.replace(`/post/${post.id}`);
      } catch (err) {
        console.error("Failed to update post:", err);
        setError(err instanceof Error ? err.message : "Failed to update post");
      } finally {
        setIsSubmitting(false);
      }
    },
    [post, isSubmitting, router]
  );

  const handleDeletePost = useCallback(async () => {
    if (!post || !username || isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deletePost(post.id);
      router.push(`/profile/${username}`);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post");
      setIsDeleting(false);
    }
  }, [post, username, isDeleting, router]);

  return {
    post,
    loading,
    error,
    isSubmitting,
    isDeleting,
    isUnauthorized,
    setError,
    handleUpdatePost,
    handleDeletePost,
  };
}
