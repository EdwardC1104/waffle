"use client";

import LoadingSpinner from "@/components/LoadingSpinner";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isFormValid: boolean;
  hasChanges: boolean;
  cancelText?: string;
  submitText?: string;
  loadingText?: string;
}

export default function FormActions({
  onCancel,
  onSubmit,
  isLoading,
  isFormValid,
  hasChanges,
  cancelText = "Cancel",
  submitText = "Save Changes",
  loadingText = "Saving...",
}: FormActionsProps) {
  const isSubmitDisabled = !isFormValid || !hasChanges || isLoading;

  return (
    <div className="px-8 py-6 bg-white flex justify-between items-center">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-3 border border-stone-300 rounded-full shadow-sm text-sm font-semibold text-stone-900 bg-white hover:bg-stone-50 transition-colors"
        disabled={isLoading}
      >
        {cancelText}
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="px-8 py-3 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>{loadingText}</span>
          </>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
}
