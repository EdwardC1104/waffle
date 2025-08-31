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

type ProfileDataType = 'posts' | 'followers' | 'following';

export default function useProfile(dataType: ProfileDataType = 'posts'): UseProfileReturn {
  
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

      // Build array of promises based on dataType
      const promises: Promise<any>[] = [fetchUser(username)];
      
      if (dataType === 'posts') {
        promises.push(fetchUserPosts(username));
      }
      
      if (dataType === 'followers') {
        promises.push(fetchFollowers(username));
      }
      
      if (dataType === 'following') {
        promises.push(fetchFollowing(username));
      }

      const results = await Promise.all(promises);
      
      setUser(results[0]);
      
      if (dataType === 'posts') {
        setPosts(results[1]);
      }
      
      if (dataType === 'followers') {
        setFollowers(results[1]);
      }
      
      if (dataType === 'following') {
        setFollowing(results[1]);
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
  }, [username, dataType]);

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