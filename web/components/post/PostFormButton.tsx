interface PostFormButtonProps {
  validation: {
    isValid: boolean;
    hasTitle: boolean;
    hasMinContent: boolean;
    characterCount: number;
    progress: number;
  };
  isSubmitting: boolean;
  submitButtonText: string;
  minChars: number;
  onSubmit: () => void;
  className?: string;
}

/** Submit button for the post form. It shows progress and validation states. */
export default function PostFormButton({
  validation,
  isSubmitting,
  submitButtonText,
  minChars,
  onSubmit,
  className = "",
}: PostFormButtonProps) {
  const getButtonText = (): string => {
    if (isSubmitting) {
      return `${submitButtonText}...`;
    }

    if (validation.isValid) {
      return submitButtonText;
    }

    if (!validation.hasMinContent) {
      return `Keep writing - ${validation.characterCount}/${minChars}`;
    }

    if (!validation.hasTitle) {
      return "Add a title";
    }

    return submitButtonText;
  };

  return (
    <button
      onClick={onSubmit}
      disabled={!validation.isValid || isSubmitting}
      className={`relative overflow-hidden px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md z-0 ${className}`}
      style={{
        color: validation.isValid && !isSubmitting ? "#fff" : "#374151",
        background: "none",
        border: "none",
      }}
    >
      <span
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
        style={{
          width: `${validation.progress * 100}%`,
          background: validation.isValid ? "#374151" : "#9ca3af",
          transitionProperty: "width, background",
          zIndex: 1,
        }}
      />
      <span className="relative" style={{ zIndex: 2 }}>
        {getButtonText()}
      </span>
    </button>
  );
}
