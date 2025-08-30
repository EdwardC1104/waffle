import { Post, User } from "../types";

async function apiRequest<T>(endpoint: string): Promise<T> {
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

  const data = await response.json();
  return data;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  return await apiRequest<User>(`/api/user/${username}`);
}

export async function getUserPosts(username: string): Promise<Post[]> {
  return await apiRequest<Post[]>(`/api/user/${username}/post`);
}

export async function getPostById(id: number): Promise<Post> {
  return await apiRequest<Post>(`/api/post/${id}`);
}

export async function getPopularFeed(): Promise<Post[]> {
  return await apiRequest<Post[]>(`/api/feed/popular`);
}

export async function getFypFeed(username: string): Promise<Post[]> {
  return await apiRequest<Post[]>(`/api/user/${username}/feed/fyp`);
}

export async function getFollowingFeed(username: string): Promise<Post[]> {
  return await apiRequest<Post[]>(`/api/user/${username}/feed/following`);
}

export async function getSuggestedUsers(): Promise<User[]> {
  return [];
}
