import { Post, SearchResult, User } from "../types";

async function post<T, U>(endpoint: string, body: U): Promise<T> {
  const response = await fetch(`${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

export async function fetchUser(username: string): Promise<User | null> {
  return await post<User, { username: string }>(`/api/user/get`, { username });
}

export async function fetchUserPosts(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/user/post/list`, {
    username,
  });
}

export async function fetchPost(id: number): Promise<Post> {
  return await post<Post, { postId: number }>(`/api/post/get`, { postId: id });
}

export async function fetchPopularFeed(): Promise<Post[]> {
  return await post<Post[], Record<string, never>>(`/api/feed/popular`, {});
}

export async function fetchFypFeed(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/feed/fyp`, {
    username,
  });
}

export async function fetchFollowingFeed(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/feed/following`, {
    username,
  });
}

export async function fetchFollowSuggestions(): Promise<User[]> {
  return await post<User[], Record<string, never>>(
    `/api/follow/suggestions`,
    {}
  );
}

export async function fetchFollowers(username: string): Promise<User[]> {
  return await post<User[], { username: string }>(`/api/follow/followers`, {
    username,
  });
}

export async function fetchFollowing(username: string): Promise<User[]> {
  return await post<User[], { username: string }>(`/api/follow/following`, {
    username,
  });
}

export async function follow(
  follower: string,
  following: string
): Promise<User[]> {
  return await post<User[], { follower: string; following: string }>(
    `/api/follow/create`,
    {
      follower,
      following,
    }
  );
}

export async function unfollow(
  follower: string,
  following: string
): Promise<User[]> {
  return await post<User[], { follower: string; following: string }>(
    `/api/follow/delete`,
    {
      follower,
      following,
    }
  );
}

export async function likePost(postId: number): Promise<Post> {
  return await post<Post, { postId: number }>(`/api/like/create`, { postId });
}

export async function unlikePost(postId: number): Promise<Post> {
  return await post<Post, { postId: number }>(`/api/like/delete`, { postId });
}

export async function search(query: string): Promise<SearchResult[]> {
  return await post<SearchResult[], { query: string }>(
    `/api/search/search-users-and-posts`,
    {
      query,
    }
  );
}

export async function editUser(
  username: string,
  name: string,
  profilePictureUrl: string
): Promise<User> {
  return await post<
    User,
    { username: string; name: string; profilePictureUrl: string }
  >(`/api/user/edit`, {
    username,
    name,
    profilePictureUrl,
  });
}

export async function deleteUser(): Promise<void> {
  return await post<void, Record<string, never>>(`/api/user/delete`, {});
}

export async function createNewPost(
  username: string,
  title: string,
  content: string,
  coverImageUrl?: string
): Promise<Post> {
  return await post<
    Post,
    { username: string; title: string; content: string; coverImageUrl?: string }
  >(`/api/post/create`, {
    username,
    title,
    content,
    ...(coverImageUrl && { coverImageUrl }),
  });
}

// Auth functions with custom error handling
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      // User is not authenticated
      return null;
    }

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      return { success: true, user: userData };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error occurred" };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function registerUser(
  name: string,
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        username,
        password,
        email,
      }),
    });

    if (response.ok) {
      const userData = await response.json();
      return { success: true, user: userData };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Network error occurred" };
  }
}
