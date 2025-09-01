"use client";

import {
  convertToBase64,
  getSupportedImageTypes,
  validateImage,
} from "@/utils/imageUtils";
import Image from "next/image";
import { useState } from "react";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";
import { ImageIcon } from "./Icons";

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string;
  onSubmit: (
    title: string,
    content: string,
    imageUrl?: string
  ) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  error: string | null;
  onErrorChange: (error: string | null) => void;
  minChars?: number;
  errorTitle?: string;
  headerTitle?: string;
  backButtonText?: string;
  backButtonUrl?: string;
}

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
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage || null
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the image
    const validation = validateImage(file, 5); // 5MB limit
    if (!validation.isValid) {
      onErrorChange(validation.error || "Invalid image file");
      return;
    }

    try {
      // Convert to base64 using utility function
      const base64String = await convertToBase64(file);
      setImagePreview(base64String);
      onErrorChange(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to process image:", err);
      onErrorChange("Failed to process the selected image");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onErrorChange(null);

    try {
      await onSubmit(title, content, imagePreview || undefined);
    } catch (err) {
      console.error("Failed to submit post:", err);
      onErrorChange(err instanceof Error ? err.message : "Failed to save post");
    }
  };

  const progress = Math.min(content.length / minChars, 1);
  const canPublish = title.trim() && content.trim().length >= minChars;

  const getButtonText = () => {
    if (isSubmitting) {
      return `${submitButtonText}...`;
    }
    if (canPublish) {
      return submitButtonText;
    }
    if (content.trim().length < minChars) {
      return `Keep writing - ${content.trim().length}/${minChars}`;
    }
    return "Add a title";
  };

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

        <button
          onClick={handleSubmit}
          disabled={!canPublish || isSubmitting}
          className="relative overflow-hidden px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md"
          style={{
            color: canPublish && !isSubmitting ? "#fff" : "#374151",
            background: "none",
            border: "none",
          }}
        >
          {/* Animated fill */}
          <span
            className="absolute left-0 top-0 h-full rounded-full z-0 transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              background: canPublish ? "#374151" : "#9ca3af",
              transitionProperty: "width, background",
            }}
          />
          <span className="relative z-10">{getButtonText()}</span>
        </button>
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

        <div>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title your post..."
            className="w-full text-3xl sm:text-4xl font-bold font-serif text-zinc-700 placeholder:text-zinc-400 border-none outline-none resize-none bg-transparent leading-tight"
            rows={2}
            style={{ minHeight: "80px" }}
          />
        </div>

        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Post preview"
                width={800}
                height={400}
                className="w-full h-64 sm:h-80 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-400 transition-colors">
              <input
                type="file"
                accept={getSupportedImageTypes()}
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <ImageIcon size={24} className="text-zinc-500" />
                </div>
                <div>
                  <p className="text-zinc-600 font-medium">
                    Add an image to your story
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Click to upload or drag and drop
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin writing..."
            className="w-full min-h-[400px] text-lg font-serif text-zinc-700 placeholder:text-zinc-400 border-none outline-none resize-none bg-transparent leading-relaxed"
            style={{ fontFamily: '"PT Serif", Georgia, serif' }}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
          <div className="text-sm text-zinc-500">
            {content.length} characters
          </div>

          <button
            type="submit"
            disabled={!canPublish || isSubmitting}
            className="relative overflow-hidden sm:hidden px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md"
            style={{
              color: canPublish && !isSubmitting ? "#fff" : "#374151",
              background: "none",
              border: "none",
            }}
          >
            <span
              className="absolute left-0 top-0 h-full rounded-full z-0 transition-all duration-500"
              style={{
                width: `${progress * 100}%`,
                background: canPublish ? "#374151" : "#9ca3af",
                transitionProperty: "width, background",
              }}
            />
            <span className="relative z-10">{getButtonText()}</span>
          </button>
        </div>
      </form>
    </>
  );
}
