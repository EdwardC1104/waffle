"use client";

import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import PostForm from "@/components/PostForm";
import { createNewPost } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  return (
    <AuthenticatedRoute>
      {(user) => <CreatePostForm user={user} />}
    </AuthenticatedRoute>
  );
}

function CreatePostForm({ user }: { user: { username: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (
    title: string,
    content: string,
    imageUrl?: string
  ) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await createNewPost(user.username, title, content, imageUrl);
      router.push(`/profile/${user.username}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
