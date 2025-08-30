"use client";

import PostActions from "@/components/PostActions";
import { Post } from "@/types";
import { getPostById } from "@/utils/api";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await getPostById(parseInt(resolvedParams.id));
        setPost(postData);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    if (error?.includes("404") || !post) {
      notFound();
    }
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading post: {error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
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
        {post.coverImageUrl && (
          <div>
            <Image
              src={post.coverImageUrl}
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
              src={post.author.profilePictureUrl}
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
          <PostActions likes={0} replies={0} bookmarks={0} />
        </div>
      </article>
    </div>
  );
}
