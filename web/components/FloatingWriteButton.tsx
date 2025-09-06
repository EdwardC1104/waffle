import Link from "next/link";
import { PlusIcon } from "./General/Icons";

export default function FloatingWriteButton() {
  return (
    <Link href="/create/post" className="lg:hidden fixed bottom-6 right-6 z-50">
      <button className="w-14 h-14 bg-stone-900 rounded-full shadow-lg flex justify-center items-center transition-opacity hover:opacity-90">
        <PlusIcon size={24} className="text-white" />
      </button>
    </Link>
  );
}
