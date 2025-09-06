import { useFeed } from "../../hooks/useFeed";
import { FeedType } from "../../types";
import ErrorMessage from "../General/ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";
import PostCard from "../PostCard";
import EmptyFeed from "./EmptyFeed";

interface FeedProps {
  feedType: FeedType;
}

const FEED_TITLES = {
  popular: "Popular Posts",
  following: "Following",
  fyp: "For You",
} as const;

/** Displays the feed of posts from the selected feed type  */
export default function Feed({ feedType }: FeedProps) {
  const { posts, loading, error, refresh, updatePost } = useFeed(feedType);

  if (loading) {
    return (
      <LoadingSpinner
        text={`Loading ${FEED_TITLES[feedType].toLowerCase()}...`}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title={`Failed to Load ${FEED_TITLES[feedType]}`}
        message={error}
        onRetry={refresh}
        showRetryButton={true}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
        ))
      ) : (
        <EmptyFeed feedType={feedType} />
      )}
    </div>
  );
}
