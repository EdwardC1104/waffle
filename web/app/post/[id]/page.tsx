"use client";

import PostActions from "@/components/PostActions";
import { mockPosts } from "@/data/mockData";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const post = mockPosts.find((p) => p.id === resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      <article className="flex flex-col gap-8">
        {post.image && (
          <div>
            <Image
              src={post.image}
              alt=""
              width={800}
              height={400}
              className="w-full h-64 sm:h-80 lg:h-96 rounded-lg object-cover"
            />
          </div>
        )}

        <header>
          <h1 className="text-zinc-800 text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-stone-900 text-sm font-medium">
                {post.author.name}
              </p>
              <p className="text-zinc-600 text-sm font-normal">
                @{post.author.username}
              </p>
            </div>
          </div>

          <p className="text-zinc-500 text-sm">
            {post.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-zinc-700 text-base sm:text-lg font-serif leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <PostActions
            likes={post.likes}
            replies={post.replies}
            bookmarks={post.bookmarks}
          />
        </div>
      </article>
    </div>
  );
}
