interface DeleteSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onDelete: () => void;
  isDeleting: boolean;
  className?: string;
}

/** Big red scary delete section. */
export default function DeleteSection({
  title,
  description,
  buttonText,
  onDelete,
  isDeleting,
  className = "",
}: DeleteSectionProps) {
  return (
    <div className={`mt-12 pt-8 border-t border-zinc-200 ${className}`}>
      <div className="bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-700 mb-4">{description}</p>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isDeleting ? `${buttonText}...` : buttonText}
        </button>
      </div>
    </div>
  );
}
