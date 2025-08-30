import Image from "next/image";
import Link from "next/link";
import { Post } from "../types";
import PostActions from "./PostActions";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="p-4 sm:p-6 bg-white/95 rounded-2xl shadow-md flex flex-col gap-4 sm:gap-6 hover:shadow-lg transition-shadow">
      <Link href={`/post/${post.id}`} className="flex flex-col gap-4 sm:gap-6">
        {post.image && (
          <Image
            src={post.image}
            alt=""
            width={552}
            height={206}
            className="w-full h-40 sm:h-48 md:h-52 rounded-lg object-cover"
          />
        )}

        <div className="flex flex-col gap-2.5">
          <h2 className="text-zinc-700 text-lg sm:text-xl md:text-2xl font-bold font-serif leading-tight">
            {post.title}
          </h2>
          <p className="text-zinc-700 text-sm font-normal font-serif leading-relaxed line-clamp-3">
            {post.content.length > 200
              ? `${post.content.substring(0, 300)}...`
              : post.content}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-stone-900 text-xs font-medium">
              {post.author.name}
            </p>
            <p className="text-zinc-600 text-xs font-normal">
              @{post.author.username}
            </p>
          </div>
        </div>
      </Link>

      {/* Action buttons outside the link to prevent nested interactive elements */}
      <PostActions
        likes={post.likes}
        replies={post.replies}
        bookmarks={post.bookmarks}
      />
    </article>
  );
}
