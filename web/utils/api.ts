import { Post, User } from "../types";

async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

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
  return await get<User>(`/api/user/${username}`);
}

export async function getUserPosts(username: string): Promise<Post[]> {
  return await get<Post[]>(`/api/user/${username}/post`);
}

export async function getPostById(id: number): Promise<Post> {
  return await get<Post>(`/api/post/${id}`);
}

export async function getPopularFeed(): Promise<Post[]> {
  return await get<Post[]>(`/api/feed/popular`);
}

export async function getFypFeed(username: string): Promise<Post[]> {
  return await get<Post[]>(`/api/user/${username}/feed/fyp`);
}

export async function getFollowingFeed(username: string): Promise<Post[]> {
  return await get<Post[]>(`/api/user/${username}/feed/following`);
}

export async function getSuggestedUsers(username: string): Promise<User[]> {
  return await get<User[]>(`/api/user/${username}/follow/suggestions`);
}

export async function postNewPost(
  username: string,
  title: string,
  content: string
): Promise<Post> {
  return await post<Post, { title: string; content: string }>(
    `/api/user/${username}/post`,
    {
      title,
      content,
    }
  );
}
