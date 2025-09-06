import Image from "next/image";

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
  const avatarSize = {
    sm: 36,
    md: 48,
    lg: 80,
  }[size];

  return (
    <Image
      src={url || "/Chicken.jpeg"}
      alt={`Profile picture of ${name}`}
      width={avatarSize}
      height={avatarSize}
      style={{
        width: avatarSize,
        height: avatarSize,
      }}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
