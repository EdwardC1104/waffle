"use client";

import useAuth from "@/hooks/useAuth";
import { Post } from "@/types";
import { likePost, unlikePost } from "@/utils/api";
import formatNumber from "@/utils/formatNumber";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookmarkIcon,
  EditIcon,
  HeartIcon,
  ReplyIcon,
  ShareIcon,
} from "./Icons";

interface PostActionsProps {
  post: Post;
  replies: number;
  bookmarks: number;
  onPostUpdate?: (updatedPost: Post) => void;
}

export default function PostActions({
  post,
  replies,
  bookmarks,
  onPostUpdate,
}: PostActionsProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Use optimistic values if available, otherwise use post values
  const isLiked =
    optimisticLiked !== null ? optimisticLiked : post.likedByAuthenticatedUser;
  const likeCount = optimisticCount !== null ? optimisticCount : post.likeCount;

  // Check if current user owns this post
  const isOwner = user && post.author.username === user.username;

  const handleLikeToggle = async () => {
    if (isLiking || !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const newLikedState = !post.likedByAuthenticatedUser;
    const newCount = post.likeCount + (newLikedState ? 1 : -1);

    setOptimisticLiked(newLikedState);
    setOptimisticCount(newCount);
    setIsLiking(true);

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
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `Check out this post by @${post.author.username}: "${post.title}"`;

    try {
      await navigator.share({
        title: post.title,
        text: shareText,
        url: postUrl,
      });
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 lg:gap-12 w-full sm:w-auto max-w-md sm:max-w-none">
      <button
        onClick={handleLikeToggle}
        disabled={isLiking}
        className={`flex items-center gap-1 sm:gap-2 transition-all duration-200 group ${
          isLiked ? "text-pink-500" : "hover:text-pink-500"
        }`}
      >
        {isLiked ? (
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`text-pink-500 transition-all duration-200 ${
              isAuthenticated ? "transform hover:scale-110" : ""
            }`}
          >
            <path d="M17.5 6.25C17.5 3.75 15.5 1.75 13 1.75C11.5 1.75 10.25 2.5 9.5 3.5C8.75 2.5 7.5 1.75 6 1.75C3.5 1.75 1.5 3.75 1.5 6.25C1.5 12.5 9.5 18.25 9.5 18.25S17.5 12.5 17.5 6.25Z" />
          </svg>
        ) : (
          <HeartIcon
            size={20}
            className={`text-gray-600 transition-all duration-200 group-hover:text-pink-500 transform hover:scale-110`}
          />
        )}
        <span
          className={`text-xs font-medium transition-colors duration-200 ${
            isLiked
              ? "text-pink-500"
              : "text-gray-600 group-hover:text-pink-500"
          }`}
        >
          {formatNumber(likeCount)}
        </span>
      </button>

      <button className="flex items-center gap-1 sm:gap-2 hover:text-blue-500 transition-colors group">
        <ReplyIcon
          size={20}
          className="text-gray-600 group-hover:text-blue-500"
        />
        <span className="text-gray-600 text-xs font-medium group-hover:text-blue-500">
          {replies}
        </span>
      </button>

      <button className="flex items-center gap-1 sm:gap-2 hover:text-yellow-600 transition-colors group">
        <BookmarkIcon
          size={20}
          className="text-gray-600 group-hover:text-yellow-600"
        />
        <span className="text-gray-600 text-xs font-medium group-hover:text-yellow-600">
          {formatNumber(bookmarks)}
        </span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-1 sm:gap-2 hover:text-green-600 transition-colors group"
      >
        <ShareIcon
          size={20}
          className="text-gray-600 group-hover:text-green-600"
        />
      </button>

      {isOwner && (
        <Link
          href={`/post/${post.id}/edit`}
          className="flex items-center gap-1 sm:gap-2 hover:text-blue-600 transition-colors group"
        >
          <EditIcon
            size={20}
            className="text-gray-600 group-hover:text-blue-600"
          />
        </Link>
      )}
    </div>
  );
}
