import { Post } from "@/types";
import Link from "next/link";

interface PostResultProps {
  post: Post;
  onResultClick: () => void;
}

/** Displays a single post result in the search results. */
export default function PostResult({ post, onResultClick }: PostResultProps) {
  return (
    <Link
      href={`/post/${post.id}`}
      onClick={onResultClick}
      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="font-medium text-[#1C1C19] mb-1">{post.title}</div>
      <div className="text-sm text-[#1C1C19]/70 mb-2 line-clamp-2">
        {post.content}
      </div>
      <div className="flex items-center text-xs text-[#1C1C19]/50">
        <span>by @{post.author.username}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
