export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  wordCount: number;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  author: User;
  likes: number;
  replies: number;
  bookmarks: number;
  createdAt: Date;
}

export interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
}
