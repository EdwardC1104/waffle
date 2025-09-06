"use client";

import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";
import PostForm from "@/components/PostForm";
import useAuth from "@/hooks/useAuth";
import { createNewPost } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  return (
    <AuthenticatedRoute>
      <CreatePostForm />
    </AuthenticatedRoute>
  );
}

function CreatePostForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const handleFormSubmit = async (
    title: string,
    content: string,
    coverImage?: File
  ) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await createNewPost(user.username, title, content, coverImage);
      router.push(`/profile/${user.username}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8 flex-1 w-full">
      <PostForm
        onSubmit={handleFormSubmit}
        submitButtonText="Publish"
        isSubmitting={isSubmitting}
        error={error}
        onErrorChange={setError}
        errorTitle="Failed to Create Post"
      />
    </div>
  );
}
