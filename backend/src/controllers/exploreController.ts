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
