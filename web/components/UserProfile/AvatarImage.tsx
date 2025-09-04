import Image from "next/image";

interface AvatarImageProps {
  profilePictureUrl?: string;
  name: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

export default function AvatarImage({
  profilePictureUrl,
  name,
  size,
  className = "",
}: AvatarImageProps) {
  const avatarClass = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }[size];

  const avatarSize = {
    sm: 36,
    md: 48,
    lg: 80,
  }[size];

  return (
    <Image
      src={profilePictureUrl || "/Chicken.jpeg"}
      alt={name}
      width={avatarSize}
      height={avatarSize}
      className={`${avatarClass} rounded-full object-cover ${className}`}
    />
  );
}
