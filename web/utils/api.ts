import { Post, SearchResult, User } from "../types";

// Post method overloaded to make body optional
async function post<T>(endpoint: string): Promise<T>;
async function post<T>(endpoint: string, body: FormData): Promise<T>;
async function post<T, U>(endpoint: string, body: U): Promise<T>;
async function post<T, U>(endpoint: string, body?: U): Promise<T> {
  const response = await fetch(`${endpoint}`, {
    method: "POST",
    headers:
      body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
    credentials: "include",
    ...(body !== undefined && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
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

export async function fetchTodayCount(): Promise<number> {
  return await post<number>(`/api/post/count/today`);
}

export async function fetchPopularFeed(): Promise<Post[]> {
  return await post<Post[]>(`/api/feed/popular`);
}

export async function fetchFypFeed(): Promise<Post[]> {
  return await post<Post[]>(`/api/feed/fyp`);
}

export async function fetchFollowingFeed(): Promise<Post[]> {
  return await post<Post[]>(`/api/feed/following`);
}

export async function fetchFollowSuggestions(): Promise<User[]> {
  return await post<User[]>(`/api/follow/suggestions`);
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

export async function search(query: string): Promise<SearchResult> {
  return await post<SearchResult, { query: string }>(
    `/api/search/search-users-and-posts`,
    {
      query,
    }
  );
}

export async function updateUserProfile(
  username: string,
  name: string,
  profilePicture: File | undefined
): Promise<User> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  return await post<User>("/api/user/update", formData);
}

export async function deleteUser(): Promise<void> {
  return await post<void>(`/api/user/delete`);
}

export async function updatePost(
  postId: number,
  title: string,
  content: string,
  coverImage: File | undefined
): Promise<Post> {
  const formData = new FormData();
  formData.append("postId", postId.toString());
  formData.append("title", title);
  formData.append("content", content);
  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  return await post<Post>(`/api/post/update`, formData);
}

export async function deletePost(postId: number): Promise<void> {
  return await post<void, { postId: number }>(`/api/post/delete`, { postId });
}

export async function createNewPost(
  username: string,
  title: string,
  content: string,
  coverImage: File | undefined
): Promise<Post> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  return await post<Post>("/api/post/create", formData);
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
