import formatNumber from "@/utils/formatNumber";
import { BookmarkIcon, HeartIcon, ReplyIcon, ShareIcon } from "./Icons";

interface PostActionsProps {
  likes: number;
  replies: number;
  bookmarks: number;
}

export default function PostActions({
  likes,
  replies,
  bookmarks,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
      <button className="flex items-center gap-1 sm:gap-2 hover:text-red-500 transition-colors group">
        <HeartIcon
          size={20}
          className="text-gray-600 group-hover:text-red-500"
        />
        <span className="text-gray-600 text-xs font-medium group-hover:text-red-500">
          {formatNumber(likes)}
        </span>
      </button>

      <button className="flex items-center gap-1 sm:gap-2 hover:text-blue-500 transition-colors group">
        <ReplyIcon
          size={20}
          className="text-gray-600 group-hover:text-blue-500"
        />
        <span className="text-gray-600 text-xs font-medium group-hover:text-blue-500">
          {replies}
        </span>
      </button>

      <button className="flex items-center gap-1 sm:gap-2 hover:text-yellow-600 transition-colors group">
        <BookmarkIcon
          size={20}
          className="text-gray-600 group-hover:text-yellow-600"
        />
        <span className="text-gray-600 text-xs font-medium group-hover:text-yellow-600">
          {formatNumber(bookmarks)}
        </span>
      </button>

      <button className="flex items-center gap-1 sm:gap-2 hover:text-green-600 transition-colors group">
        <ShareIcon
          size={20}
          className="text-gray-600 group-hover:text-green-600"
        />
      </button>
    </div>
  );
}
