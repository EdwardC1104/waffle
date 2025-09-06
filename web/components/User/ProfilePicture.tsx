import Image from "next/image";
import { useState } from "react";

interface ProfilePictureProps {
  url?: string;
  name: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

/** Displays a user's profile picture in 3 sizes.
 * Includes a default image if no profile picture URL is provided.
 */
export default function ProfilePicture({
  url,
  name,
  size,
  className = "",
}: ProfilePictureProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const avatarSize = {
    sm: 36,
    md: 48,
    lg: 80,
  }[size];

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Use chicken as fallback for both no URL and error cases
  const imageSrc = hasError || !url ? "/Chicken.jpeg" : url;

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-pulse rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
          }}
        />
      )}

      <Image
        src={imageSrc}
        alt={`${name} profile picture`}
        width={avatarSize}
        height={avatarSize}
        style={{
          width: avatarSize,
          height: avatarSize,
        }}
        className={`rounded-full object-cover transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
