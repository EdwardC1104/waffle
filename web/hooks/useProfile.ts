import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Post, User } from "@/types";
import { fetchUser, fetchUserPosts, fetchFollowers, fetchFollowing } from "@/utils/api";

interface UseProfileReturn {
  user: User | null;
  posts: Post[];
  followers: User[];
  following: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  handlePostUpdate: (updatedPost: Post) => void;
}

interface UseProfileOptions {
  includePosts?: boolean;
  includeFollowers?: boolean;
  includeFollowing?: boolean;
}

export default function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const { 
    includePosts = true, 
    includeFollowers = false, 
    includeFollowing = false 
  } = options;
  
  const username = useParams().username;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username || typeof username !== "string") {
        setError("No username provided in URL");
        setUser(null);
        return;
      }

      // Build array of promises based on options
      const promises: Promise<any>[] = [fetchUser(username)];
      
      if (includePosts) {
        promises.push(fetchUserPosts(username));
      }
      
      if (includeFollowers) {
        promises.push(fetchFollowers(username));
      }
      
      if (includeFollowing) {
        promises.push(fetchFollowing(username));
      }

      const results = await Promise.all(promises);
      
      let resultIndex = 1; // Start after user data
      setUser(results[0]);
      
      if (includePosts) {
        setPosts(results[resultIndex]);
        resultIndex++;
      }
      
      if (includeFollowers) {
        setFollowers(results[resultIndex]);
        resultIndex++;
      }
      
      if (includeFollowing) {
        setFollowing(results[resultIndex]);
        resultIndex++;
      }

    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load user profile"
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username, includePosts, includeFollowers, includeFollowing]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    user,
    posts,
    followers,
    following,
    loading,
    error,
    refetch: fetchUserData,
    handlePostUpdate,
  };
}