import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get explore feed: suggested posts and users
export const getExploreFeed = async (req: Request, res: Response) => {
  try {
    // For MVP: random posts and users (excluding current user)
    const userId = req.query.userId as string;
    const posts = await prisma.post.findMany({
      where: userId ? { userId: { not: userId } } : {},
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { id: true, username: true, profilePictureUrl: true } },
        likes: true,
        comments: true,
      },
    });
    const users = await prisma.user.findMany({
      where: userId ? { id: { not: userId } } : {},
      take: 10,
      select: { id: true, username: true, profilePictureUrl: true, bio: true },
    });
    res.json({ posts, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch explore feed' });
  }
};

// GET /api/hashtags/:tag/posts - Get posts by hashtag
export const getPostsByHashtag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;
    const hashtag = await prisma.hashtag.findUnique({ where: { tag: tag.toLowerCase() } });
    if (!hashtag) return res.json([]);
    const postHashtags = await prisma.postHashtag.findMany({
      where: { hashtagId: hashtag.id },
      include: { post: { include: { user: true, _count: { select: { likes: true, comments: true } } } } },
    });
    const posts = postHashtags.map(ph => ph.post);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts by hashtag' });
  }
};

// GET /api/hashtags/search?q= - Search hashtags
export const searchHashtags = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.json([]);
    const hashtags = await prisma.hashtag.findMany({
      where: { tag: { contains: q.toLowerCase() } },
      take: 20,
      orderBy: { tag: 'asc' },
    });
    res.json(hashtags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hashtags' });
  }
};
