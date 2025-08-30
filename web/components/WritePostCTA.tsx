interface WritePostCTAProps {
  todayWordCount: number;
}

export default function WritePostCTA({ todayWordCount }: WritePostCTAProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <div className="text-stone-900 text-xl font-semibold">
          Ready to share your thoughts?
        </div>
        <div className="text-stone-900 text-xs">
          <span className="font-semibold">{formatNumber(todayWordCount)}</span>
          <span className="font-normal">
            {" "}
            words have been posted so far today - add yours.
          </span>
        </div>
      </div>

      <button className="px-6 py-2 bg-stone-900 rounded-full shadow-lg flex justify-center items-center transition-opacity hover:opacity-90">
        <span className="text-white text-xs font-semibold">Write Post</span>
      </button>
    </div>
  );
}
