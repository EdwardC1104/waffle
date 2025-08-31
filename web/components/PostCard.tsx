import Image from "next/image";
import Link from "next/link";
import { Post } from "../types";
import PostActions from "./PostActions";
import UserProfile from "./UserProfile";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="p-4 sm:p-6 bg-white/95 rounded-2xl shadow-md flex flex-col gap-4 sm:gap-6 hover:shadow-lg transition-shadow">
      <Link href={`/post/${post.id}`} className="flex flex-col gap-4 sm:gap-6">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
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
        </Link>
        <div className="flex items-center gap-1.5">
          <UserProfile user={post.author} size="sm" />
        </div>

      <PostActions likes={0} replies={0} bookmarks={0} />
    </article>
  );
}
