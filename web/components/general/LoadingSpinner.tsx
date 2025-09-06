interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  center?: boolean;
}

/** A simple loading spinner with optional text */
export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
  center = false,
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }[size];

  const containerClasses = [
    "flex flex-col items-center justify-center",
    center && "w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-b-2 border-gray-900 mb-4 ${sizeClass}`}
      />
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
