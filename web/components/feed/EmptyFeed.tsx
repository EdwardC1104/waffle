import type { FeedType } from "../../types";

const EMPTY_STATE_MESSAGES = {
  popular: "No popular posts available right now.",
  following:
    "You don't follow anyone yet. Start following users to see their posts here.",
  fyp: "Nothing to see here yet. Start creating posts or following users to build your feed.",
} as const;

/**
 * Component for displaying empty feed state with appropriate messaging
 */
function EmptyFeed({ feedType }: { feedType: FeedType }) {
  return (
    <div className="self-center text-center py-8">
      <p className="text-zinc-600 text-lg mb-2">
        {EMPTY_STATE_MESSAGES[feedType]}
      </p>
      {feedType === "following" && (
        <p className="text-zinc-500 text-sm">
          Try exploring the Popular feed to discover new users to follow.
        </p>
      )}
    </div>
  );
}

export default EmptyFeed;
