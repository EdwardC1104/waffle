"use client";

import { useCallback, useEffect, useState } from "react";

interface UsePostFormOptions {
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string;
  onSubmit: (
    title: string,
    content: string,
    deleteCoverImage: boolean,
    coverImage?: File
  ) => Promise<void>;
  onError: (error: string | null) => void;
  minChars?: number;
}

interface PostFormValidation {
  hasTitle: boolean;
  hasMinContent: boolean;
  isValid: boolean;
  progress: number;
  characterCount: number;
}

/** Hook to manage post form state and validation. Used by the post creation and editing forms. */
export function usePostForm({
  initialTitle = "",
  initialContent = "",
  initialImage = "",
  onSubmit,
  onError,
  minChars = 2000,
}: UsePostFormOptions) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup image preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validation: PostFormValidation = {
    hasTitle: Boolean(title.trim()),
    hasMinContent: content.trim().length >= minChars,
    characterCount: content.trim().length,
    progress: Math.min(content.trim().length / minChars, 1),
    get isValid() {
      return this.hasTitle && this.hasMinContent;
    },
  };

  const handleImageChange = useCallback(
    (file: File | null) => {
      // Cleanup previous preview URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setCoverImage(file);
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    },
    [imagePreview]
  );

  const removeImage = useCallback(() => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setCoverImage(null);
  }, [imagePreview]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validation.isValid || isSubmitting) {
        return;
      }

      onError(null);
      setIsSubmitting(true);

      try {
        await onSubmit(title.trim(), content.trim(), imagePreview === null, coverImage || undefined);
      } catch (err) {
        console.error("Failed to submit post:", err);
        onError(err instanceof Error ? err.message : "Failed to save post");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      title,
      content,
      coverImage,
      onSubmit,
      onError,
      validation.isValid,
      isSubmitting,
    ]
  );

  return {
    title,
    setTitle,
    content,
    setContent,
    coverImage,
    imagePreview,
    isSubmitting,
    validation,
    handleImageChange,
    removeImage,
    handleSubmit,
  };
}
