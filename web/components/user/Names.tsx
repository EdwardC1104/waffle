interface NamesProps {
  name: string;
  username: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

/** Displays a user's name and username in 3 different sizes. */
export default function Names({
  name,
  username,
  size,
  className = "",
}: NamesProps) {
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
      <p className={`text-zinc-600 font-normal truncate ${usernameClass}`}>
        @{username}
      </p>
    </div>
  );
}
