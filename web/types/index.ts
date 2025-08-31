export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePictureUrl: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string;
  author: User;
  createdAt: string;
}
