"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle post submission when backend is ready
    console.log("Post would be submitted:", { title, content, selectedImage });
  };

  const minChars = 2000;
  const progress = Math.min(content.length / minChars, 1);

  const canPublish = title.trim() && content.trim().length >= minChars;
  const getButtonText = () => {
    if (canPublish) {
      return "Publish";
    }
    if (content.trim().length < minChars) {
      return `Keep writing - ${content.trim().length}/${minChars}`;
    }
    return "Add a title";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-zinc-600 hover:text-zinc-800 transition-colors cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-700 font-serif">
            Write a Post
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canPublish}
          className="relative overflow-hidden px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md"
          style={{
            color: canPublish ? "#fff" : "#374151",
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
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
            disabled={!canPublish}
            className="relative overflow-hidden sm:hidden px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md"
            style={{
              color: canPublish ? "#fff" : "#374151",
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

      {/* <div className="mt-8 p-4 bg-zinc-50 rounded-lg">
        <p className="text-sm text-zinc-600">
          <span className="font-medium">Draft saved automatically.</span> Your
          work is safe and will be preserved until you&apos;re ready to publish.
        </p>
      </div> */}
    </div>
  );
}
