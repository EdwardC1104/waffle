import formatNumber from "@/utils/formatNumber";
import Image from "next/image";
import { Post } from "../types";
import { BookmarkIcon, HeartIcon, ReplyIcon, ShareIcon } from "./Icons";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="p-6 bg-white/95 rounded-2xl shadow-md flex flex-col gap-6 hover:shadow-lg transition-shadow">
      {post.image && (
        <Image
          src={post.image}
          alt=""
          width={552}
          height={206}
          className="w-full h-52 rounded-lg object-cover"
        />
      )}

      <div className="flex flex-col gap-2.5">
        <h2 className="text-zinc-700 text-2xl font-bold font-serif leading-tight">
          {post.title}
        </h2>
        <p className="text-zinc-700 text-sm font-normal font-serif leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="flex justify-between items-end">
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

        <div className="flex items-center gap-12">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors group">
            <HeartIcon
              size={20}
              className="text-stone-900 group-hover:text-red-500"
            />
            <span className="text-stone-900 text-xs font-medium group-hover:text-red-500">
              {formatNumber(post.likes)}
            </span>
          </button>

          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors group">
            <ReplyIcon
              size={20}
              className="text-stone-900 group-hover:text-blue-500"
            />
            <span className="text-stone-900 text-xs font-medium group-hover:text-blue-500">
              {post.replies}
            </span>
          </button>

          <button className="flex items-center gap-1 hover:text-yellow-600 transition-colors group">
            <BookmarkIcon
              size={20}
              className="text-stone-900 group-hover:text-yellow-600"
            />
            <span className="text-stone-900 text-xs font-medium group-hover:text-yellow-600">
              {formatNumber(post.bookmarks)}
            </span>
          </button>

          <button className="flex items-center gap-2 hover:text-green-600 transition-colors group">
            <ShareIcon
              size={20}
              className="text-stone-900 group-hover:text-green-600"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
