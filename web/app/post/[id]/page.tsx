"use client";

import PostActions from "@/components/feed/PostActions";
import BackButton from "@/components/general/BackButton";
import ErrorMessage from "@/components/general/ErrorMessage";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import UserProfile from "@/components/user/UserProfile";
import { Post } from "@/types";
import { fetchPost } from "@/utils/api";
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

  const handlePostUpdate = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  useEffect(() => {
    const get = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await fetchPost(parseInt(resolvedParams.id));
        setPost(postData);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    get();
  }, [resolvedParams.id]);

  if (loading) {
    return <LoadingSpinner text="Loading post..." center />;
  }

  if (error || !post) {
    if (error?.includes("404") || !post) {
      notFound();
    }
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage
          title="Failed to Load Post"
          message={error || "Post not found"}
          onRetry={() => router.back()}
          showRetryButton={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton className="mb-6" />

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
            <UserProfile user={post.author} size="sm" />
          </div>

          <p className="text-zinc-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString("en-GB", {
              weekday: "long",
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
            post={post}
            replies={0}
            bookmarks={0}
            onPostUpdate={handlePostUpdate}
          />
        </div>
      </article>
    </div>
  );
}
