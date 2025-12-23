import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl, caption } = req.body;
    const userId = req.userId;
    if (!userId || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const post = await prisma.post.create({
      data: { userId, imageUrl, caption },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getAllPosts = async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.post.delete({ where: { id: postId } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const like = await prisma.like.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
    res.json(like);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

export const commentOnPost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { content } = req.body;
    if (!userId || !content) return res.status(400).json({ error: 'Missing fields' });
    const comment = await prisma.comment.create({
      data: { userId, postId, content },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to comment on post' });
  }
};

// Fetch all comments for a specific post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}