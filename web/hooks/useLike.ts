"use client";

import { Post } from "@/types";
import { likePost, unlikePost } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuth from "./useAuth";

interface UseLikeProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

/** Allows a user to like or unlike a post. */
export default function useLike({ post, onPostUpdate }: UseLikeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Use optimistic values if available, otherwise use post values
  const isLiked =
    optimisticLiked !== null ? optimisticLiked : post.likedByAuthenticatedUser;
  const likeCount = optimisticCount !== null ? optimisticCount : post.likeCount;

  const toggleLike = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(
        `/post/${post.id}`
      )}`;
      router.push(redirectUrl);
      return;
    }

    // Optimistic update
    const newLikedState = !post.likedByAuthenticatedUser;
    const newCount = post.likeCount + (newLikedState ? 1 : -1);

    setOptimisticLiked(newLikedState);
    setOptimisticCount(newCount);
    setIsLoading(true);

    try {
      const updatedPost = post.likedByAuthenticatedUser
        ? await unlikePost(post.id)
        : await likePost(post.id);

      // Clear optimistic state and use real data
      setOptimisticLiked(null);
      setOptimisticCount(null);

      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert optimistic update
      setOptimisticLiked(null);
      setOptimisticCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
  };
}
