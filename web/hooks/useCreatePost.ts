import { createNewPost } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseCreatePostOptions {
  username?: string;
}

/** Hook to manage the creation of a new post. */
export function useCreatePost({ username }: UseCreatePostOptions) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (
    title: string,
    content: string,
    coverImage?: File
  ) => {
    if (!username) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await createNewPost(username, title, content, coverImage);
      router.push(`/profile/${username}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    setError,
    isSubmitting,
    handleCreatePost,
  };
}
