import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  text?: string;
  goTo?: string;
}

export default function BackButton({
  className = "",
  text = "Back",
  goTo,
}: BackButtonProps) {
  const router = useRouter();
  const handleClick = () => {
    if (goTo) {
      router.push(goTo);
    } else {
      router.back();
    }
  };
  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-zinc-600 hover:text-stone-900 transition-colors ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}
