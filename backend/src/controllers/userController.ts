import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string }; // Adjust the type as needed
}

const prisma = new PrismaClient();

// POST /api/users/:id/follow
export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params; // user to follow
  const userId = req.user.id; // current user (from auth middleware)
  if (id === userId) return res.status(400).json({ error: "Cannot follow yourself" });

  await prisma.follow.create({
    data: { followerId: userId, followingId: id }
  });
  res.json({ success: true });
};

// POST /api/users/:id/unfollow
export const unfollowUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  await prisma.follow.deleteMany({
    where: { followerId: userId, followingId: id }
  });
  res.json({ success: true });
};