interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
}

/** Submit button for authentication forms. */
export default function SubmitButton({
  isLoading,
  loadingText,
  defaultText,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3 px-6 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? loadingText : defaultText}
    </button>
  );
}
