"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Post } from "../../types";
import UserProfile from "../user/UserProfile";
import CoverImage from "./CoverImage";
import PostActions from "./PostActions";

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

const CONTENT_PREVIEW_LENGTH = 300;
const COVER_IMAGE_DIMENSIONS = {
  width: 552,
  height: 208,
} as const;

/**
 * PostCard component displays a post with its cover image, title, content preview,
 * author information, and action buttons in a card format.
 */
export default function PostCard({
  post: initialPost,
  onPostUpdate,
}: PostCardProps) {
  const [post, setPost] = useState(initialPost);

  const handlePostUpdate = useCallback(
    (updatedPost: Post) => {
      setPost(updatedPost);
      onPostUpdate?.(updatedPost);
    },
    [onPostUpdate]
  );

  const truncatedContent =
    post.content.length > CONTENT_PREVIEW_LENGTH
      ? `${post.content.substring(0, CONTENT_PREVIEW_LENGTH)}...`
      : post.content;

  const postUrl = `/post/${post.id}`;

  return (
    <div className="p-4 sm:p-6 bg-white/95 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
      <Link
        href={postUrl}
        className="block space-y-4 sm:space-y-6 group"
        aria-label={`Read full post: ${post.title}`}
      >
        {post.coverImageUrl && (
          <CoverImage
            url={post.coverImageUrl}
            alt={`Cover image for "${post.title}"`}
            width={COVER_IMAGE_DIMENSIONS.width}
            height={COVER_IMAGE_DIMENSIONS.height}
            className="w-full h-40 sm:h-48 md:h-52 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            priority={false}
          />
        )}

        <div className="space-y-2.5">
          <h2 className="text-zinc-700 text-lg sm:text-xl md:text-2xl font-bold font-serif leading-tight line-clamp-2">
            {post.title}
          </h2>
          <p className="text-zinc-600 text-sm font-normal font-serif leading-relaxed line-clamp-3">
            {truncatedContent}
          </p>
        </div>
      </Link>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center">
          <UserProfile user={post.author} size="sm" />
        </div>

        <PostActions
          post={post}
          replies={0}
          bookmarks={0}
          onPostUpdate={handlePostUpdate}
        />
      </div>
    </div>
  );
}
