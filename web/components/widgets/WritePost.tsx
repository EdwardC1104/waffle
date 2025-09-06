import useTodayWordCount from "@/hooks/useTodayWordCount";
import formatNumber from "@/utils/formatNumber";
import Link from "next/link";

/** Asks the user to write a post */
export default function WritePost() {
  const { todayWordCount } = useTodayWordCount();

  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <div className="text-stone-900 text-xl font-semibold">
          Ready to share your thoughts?
        </div>
        <div className="text-stone-900 text-xs">
          {todayWordCount === 0 ? (
            <span className="font-normal">
              Be the first to post today - share your thoughts.
            </span>
          ) : (
            <>
              <span className="font-semibold">
                {formatNumber(todayWordCount, false)}
              </span>
              <span className="font-normal">
                {" "}
                word{todayWordCount !== 1 ? "s" : ""} have been posted so far
                today - add yours.
              </span>
            </>
          )}
        </div>
      </div>

      <Link href="/create/post" className="w-fit">
        <button className="px-6 py-2 bg-stone-900 rounded-full shadow-lg flex justify-center items-center transition-opacity hover:opacity-90">
          <span className="text-white text-xs font-semibold">Write Post</span>
        </button>
      </Link>
    </div>
  );
}
