"use client";

import useAuth from "@/hooks/useAuth";
import useLike from "@/hooks/useLike";
import useShare from "@/hooks/useShare";
import { Post } from "@/types";
import formatNumber from "@/utils/formatNumber";
import Link from "next/link";
import {
  BookmarkIcon,
  EditIcon,
  HeartIcon,
  ReplyIcon,
  ShareIcon,
} from "../general/Icons";

interface PostActionsProps {
  post: Post;
  replies: number;
  bookmarks: number;
  onPostUpdate?: (updatedPost: Post) => void;
}

/** Implements all the buttons that go at the bottom of a post. */
export default function PostActions({
  post,
  replies,
  bookmarks,
  onPostUpdate,
}: PostActionsProps) {
  const { user, isAuthenticated } = useAuth();
  const { isLiked, likeCount, isLoading, toggleLike } = useLike({
    post,
    onPostUpdate,
  });
  const { sharePost } = useShare({ post });

  // Check if current user owns this post
  const isOwner = user && post.author.username === user.username;

  return (
    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 lg:gap-12 w-full sm:w-auto max-w-md sm:max-w-none">
      {/* Like Button */}
      <button
        onClick={toggleLike}
        disabled={isLoading}
        className={`flex items-center gap-1 sm:gap-2 transition-all duration-200 group ${
          isLiked ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
        }`}
      >
        <HeartIcon
          size={20}
          filled={isLiked}
          className={`transition-all duration-200 ${
            isAuthenticated ? "transform hover:scale-110" : ""
          }`}
        />
        <span className="text-xs font-medium">{formatNumber(likeCount)}</span>
      </button>

      {/* Reply Button */}
      <button className="flex items-center gap-1 sm:gap-2 transition-all duration-200 text-gray-600 hover:text-blue-500">
        <ReplyIcon size={20} className="hover:text-blue-500" />
        <span className="text-xs font-medium">{replies}</span>
      </button>

      {/* Bookmark Button */}
      <button className="flex items-center gap-1 sm:gap-2 transition-all duration-200 text-gray-600 hover:text-yellow-600">
        <BookmarkIcon size={20} className="hover:text-yellow-600" />
        <span className="text-xs font-medium">{formatNumber(bookmarks)}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={sharePost}
        className="flex items-center gap-1 sm:gap-2 transition-all duration-200 text-gray-600 hover:text-green-600"
      >
        <ShareIcon size={20} className="hover:text-green-600" />
      </button>

      {/* Edit Button - Only show for post owner */}
      {isOwner && (
        <Link
          href={`/post/${post.id}/edit`}
          className="flex items-center gap-1 sm:gap-2 transition-all duration-200 text-gray-600 hover:text-blue-600"
        >
          <EditIcon size={20} className="hover:text-blue-600" />
        </Link>
      )}
    </div>
  );
}
