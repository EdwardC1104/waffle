import { Post, User } from "../types";

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

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  return await post<User, { username: string }>(`/api/user/get`, { username });
}

export async function getUserPosts(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/user/post/list`, {
    username,
  });
}

export async function getPostById(id: number): Promise<Post> {
  return await post<Post, { postId: number }>(`/api/post/get`, { postId: id });
}

export async function getPopularFeed(): Promise<Post[]> {
  return await post<Post[], Record<string, never>>(`/api/feed/popular`, {});
}

export async function getFypFeed(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/feed/fyp`, {
    username,
  });
}

export async function getFollowingFeed(username: string): Promise<Post[]> {
  return await post<Post[], { username: string }>(`/api/feed/following`, {
    username,
  });
}

export async function getSuggestedUsers(username: string): Promise<User[]> {
  return await post<User[], { username: string }>(`/api/follow/suggestions`, {
    username,
  });
}

export async function getFollowers(username: string): Promise<User[]> {
  return await post<User[], { username: string }>(`/api/follow/followers`, {
    username,
  });
}

export async function getFollowing(username: string): Promise<User[]> {
  return await post<User[], { username: string }>(`/api/follow/following`, {
    username,
  });
}

export async function postNewPost(
  username: string,
  title: string,
  content: string
): Promise<Post> {
  return await post<Post, { username: string; title: string; content: string }>(
    `/api/post/create`,
    {
      username,
      title,
      content,
    }
  );
}
