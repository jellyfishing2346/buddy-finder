export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}