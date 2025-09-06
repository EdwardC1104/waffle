interface UserInfoProps {
  name: string;
  username: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

export default function UserInfo({
  name,
  username,
  size,
  className = "",
}: UserInfoProps) {
  const nameClass = {
    sm: "text-xs font-medium",
    md: "text-xs font-medium",
    lg: "text-2xl font-bold",
  }[size];

  const usernameClass = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-lg",
  }[size];

  return (
    <div className={className}>
      <p className={`text-stone-900 ${nameClass}`}>{name}</p>
      <p
        className={`text-zinc-600 font-normal ${usernameClass} ${
          size === "sm" ? "truncate" : ""
        }`}
      >
        @{username}
      </p>
    </div>
  );
}
