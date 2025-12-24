import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Utility to extract hashtags from text
function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#(\w+)/g);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}

// Utility to extract tagged usernames from text
function extractTaggedUsernames(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/@(\w+)/g);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}

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
    // Hashtag logic
    const hashtags = extractHashtags(caption);
    for (const tag of hashtags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { tag },
        update: {},
        create: { tag },
      });
      await prisma.postHashtag.create({
        data: { postId: post.id, hashtagId: hashtag.id },
      });
    }
    // User tagging logic
    const taggedUsernames = extractTaggedUsernames(caption);
    if (taggedUsernames.length > 0) {
      const taggedUsers = await prisma.user.findMany({ where: { username: { in: taggedUsernames } } });
      for (const taggedUser of taggedUsers) {
        await prisma.postTag.create({ data: { postId: post.id, userId: taggedUser.id } });
        // TODO: Optionally, trigger notification for taggedUser.id
      }
    }
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
    // Hashtag logic for comments
    const hashtags = extractHashtags(content);
    for (const tag of hashtags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { tag },
        update: {},
        create: { tag },
      });
      await prisma.commentHashtag.create({
        data: { commentId: comment.id, hashtagId: hashtag.id },
      });
    }
    // User tagging logic for comments
    const taggedUsernames = extractTaggedUsernames(content);
    if (taggedUsernames.length > 0) {
      const taggedUsers = await prisma.user.findMany({ where: { username: { in: taggedUsernames } } });
      for (const taggedUser of taggedUsers) {
        await prisma.commentTag.create({ data: { commentId: comment.id, userId: taggedUser.id } });
        // TODO: Optionally, trigger notification for taggedUser.id
      }
    }
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
};

export const savePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    if (!userId || !postId) return res.status(400).json({ error: 'Missing fields' });
    await prisma.savedPost.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
    res.json({ message: 'Post saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save post' });
  }
};

export const unsavePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    if (!userId || !postId) return res.status(400).json({ error: 'Missing fields' });
    await prisma.savedPost.delete({ where: { userId_postId: { userId, postId } } });
    res.json({ message: 'Post unsaved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsave post' });
  }
};

export const getSavedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const saved = await prisma.savedPost.findMany({
      where: { userId },
      include: { post: { include: { user: true, _count: { select: { likes: true, comments: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    const posts = saved.map(s => s.post);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved posts' });
  }
};