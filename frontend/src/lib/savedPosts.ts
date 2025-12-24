import { postsAPI } from './api';

export const savePost = async (postId: string) => {
  return postsAPI.savePost(postId);
};

export const unsavePost = async (postId: string) => {
  return postsAPI.unsavePost(postId);
};

export const getSavedPosts = async () => {
  return postsAPI.getSavedPosts();
};
