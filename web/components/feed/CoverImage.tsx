"use client";

import Image from "next/image";
import { useState } from "react";
import ErrorMessage from "../general/ErrorMessage";

interface CoverImageProps {
  url: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/** CoverImage renders the image with a loading placeholder. */
export default function CoverImage({
  url,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: CoverImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Loading placeholder */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}

      {/* Error placeholder */}
      {hasError && !isLoading && (
        <div
          className="absolute inset-0 bg-zinc-50 flex items-center justify-center"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <ErrorMessage
            title="Image Error"
            message="Unable to load image"
            showRetryButton={false}
            className="p-2"
          />
        </div>
      )}

      {/* Actual image */}
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
