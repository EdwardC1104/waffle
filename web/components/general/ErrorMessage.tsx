import { AlertTriangleIcon } from "./Icons";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
  className?: string;
}

/** A reusable error message component with an optional retry button. */
export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  showRetryButton = true,
  className = "",
}: ErrorMessageProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <AlertTriangleIcon size={24} className="text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
