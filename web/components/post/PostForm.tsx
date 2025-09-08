"use client";

import { usePostForm } from "@/hooks/usePostForm";
import BackButton from "../general/BackButton";
import ErrorMessage from "../general/ErrorMessage";
import AutoResizeTextarea from "./AutoResizeTextarea";
import ImageUpload from "./ImageUpload";
import PostFormButton from "./PostFormButton";

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string;
  onSubmit: (
    title: string,
    content: string,
    coverImage?: File
  ) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  error: string | null;
  onErrorChange: (error: string | null) => void;
  errorTitle?: string;
  minChars?: number;
  headerTitle?: string;
  backButtonText?: string;
  backButtonUrl?: string;
}

/** Form used for creating and editing posts. */
export default function PostForm({
  initialTitle = "",
  initialContent = "",
  initialImage = "",
  onSubmit,
  submitButtonText,
  isSubmitting,
  error,
  onErrorChange,
  minChars = 2000,
  errorTitle = "Failed to Save Post",
  headerTitle = "Write a Post",
  backButtonText = "",
  backButtonUrl,
}: PostFormProps) {
  const {
    title,
    setTitle,
    content,
    setContent,
    imagePreview,
    validation,
    handleImageChange,
    removeImage,
    handleSubmit,
  } = usePostForm({
    initialTitle,
    initialContent,
    initialImage,
    onSubmit,
    onError: onErrorChange,
    minChars,
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton
            text={backButtonText}
            goTo={backButtonUrl}
            className="text-zinc-600 hover:text-zinc-800"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-700 font-serif">
            {headerTitle}
          </h1>
        </div>

        {/* Desktop Submit Button */}
        <PostFormButton
          validation={validation}
          isSubmitting={isSubmitting}
          submitButtonText={submitButtonText}
          minChars={minChars}
          onSubmit={() => handleSubmit()}
          className="hidden sm:flex"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <ErrorMessage
            title={errorTitle}
            message={error}
            onRetry={() => onErrorChange(null)}
            showRetryButton={false}
            className="mb-4"
          />
        )}

        {/* Title Input */}
        <div>
          <AutoResizeTextarea
            value={title}
            onChange={setTitle}
            placeholder="Title your post..."
            className="w-full text-3xl sm:text-4xl font-bold font-serif text-zinc-700 placeholder:text-zinc-400 leading-tight"
            rows={2}
            style={{ minHeight: "80px" }}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <ImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            onError={onErrorChange}
          />
        </div>

        {/* Content Input */}
        <div>
          <AutoResizeTextarea
            value={content}
            onChange={setContent}
            placeholder="Begin writing..."
            className="w-full min-h-[400px] text-lg font-serif text-zinc-700 placeholder:text-zinc-400 leading-relaxed"
            style={{ fontFamily: '"PT Serif", Georgia, serif' }}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-zinc-500">
            {validation.characterCount} characters
          </div>

          {/* Mobile Submit Button */}
          <PostFormButton
            validation={validation}
            isSubmitting={isSubmitting}
            submitButtonText={submitButtonText}
            minChars={minChars}
            onSubmit={() => handleSubmit()}
            className="flex sm:hidden"
          />
        </div>
      </form>
    </>
  );
}
