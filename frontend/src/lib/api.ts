// Users API
export const usersAPI = {
  discover: async (): Promise<Array<User & { compatibility: number; sharedInterests: string[] }>> => {
    const response = await api.get('/users/discover');
    return response.data;
  },
  connect: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${userId}/connect`);
    return response.data;
  },
};
import axios from 'axios';
import type { AuthResponse, Post, Comment } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },

  createPost: async (data: {
    imageUrl: string;
    caption?: string;
  }): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },

  likePost: async (postId: string): Promise<{ message: string; liked: boolean }> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  commentOnPost: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comment`, { content });
    return response.data;
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
};

export default api;