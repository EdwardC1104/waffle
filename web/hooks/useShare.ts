import { Post } from "@/types";

interface UseShareProps {
  post: Post;
}

/** Allows a user to share a post. */
export default function useShare({ post }: UseShareProps) {
  const sharePost = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `Check out this post by @${post.author.username}: "${post.title}"`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: postUrl,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(postUrl);
        // You might want to show a toast notification here
        console.log("Post URL copied to clipboard");
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  };

  return { sharePost };
}
