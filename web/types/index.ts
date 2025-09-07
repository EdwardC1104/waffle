export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  followerCount: number;
  followingCount: number;
  wordCount: number;
  followedByAuthenticatedUser: boolean;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string;
  author: User;
  createdAt: string;
  likeCount: number;
  likedByAuthenticatedUser: boolean;
};

export type FeedType = "fyp" | "following" | "popular";

export type SearchResult = {
  posts: Post[];
  users: User[];
};
