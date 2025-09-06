import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./Icons";

interface BackButtonProps {
  className?: string;
  text?: string;
  goTo?: string;
}

/** A back button that navigates to the page the user came from or a specified URL. */
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
      <ArrowLeftIcon size={20} />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}
