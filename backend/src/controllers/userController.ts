// PUT /api/users/:id (update profile)
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId || userId !== id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { fullName, bio, profilePictureUrl, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        bio,
        profilePictureUrl,
        email,
      },
    });
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      bio: updatedUser.bio,
      profilePictureUrl: updatedUser.profilePictureUrl,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const prisma = new PrismaClient();

// POST /api/users/:id/follow
export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params; // user to follow
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  if (id === userId) return res.status(400).json({ error: "Cannot follow yourself" });
  await prisma.follow.create({
    data: { followerId: userId, followingId: id }
  });
  res.json({ success: true });
};

// POST /api/users/:id/unfollow
export const unfollowUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  await prisma.follow.deleteMany({
    where: { followerId: userId, followingId: id }
  });
  res.json({ success: true });
};

// POST /api/users/:id/interests
export const selectInterests = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { interests } = req.body; // [{ interestId, weight }]
  if (!Array.isArray(interests)) return res.status(400).json({ error: 'Invalid interests format' });
  await prisma.userInterest.deleteMany({ where: { userId: id } });
  await prisma.userInterest.createMany({
    data: interests.map((i: { interestId: string, weight?: number }) => ({
      userId: id,
      interestId: i.interestId,
      weight: i.weight ?? 1
    }))
  });
  res.json({ success: true });
};

// GET /api/users/:id/interests
export const getUserInterests = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const interests = await prisma.userInterest.findMany({
    where: { userId: id },
    include: { interest: true }
  });
  res.json(interests);
};

// GET /api/users/:id/matches
export const getMatchedUsers = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  // Get current user's interests
  const userInterests = await prisma.userInterest.findMany({ where: { userId: id } });
  const interestIds = userInterests.map((ui: { interestId: string }) => ui.interestId);
  // Find other users with shared interests
  const matches = await prisma.userInterest.findMany({
    where: {
      interestId: { in: interestIds },
      userId: { not: id }
    },
    include: { user: true }
  });
  // Aggregate by user and score
  const scores: Record<string, { user: any, score: number }> = {};
  matches.forEach((m: { userId: string, user: any, weight: number }) => {
    if (!scores[m.userId]) scores[m.userId] = { user: m.user, score: 0 };
    scores[m.userId].score += m.weight;
  });
  const result = Object.values(scores).sort((a, b) => b.score - a.score);
  res.json(result);
};

// GET /api/users/:id/interest-feed
export const getInterestFeed = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  // Get user's interests
  const userInterests = await prisma.userInterest.findMany({ where: { userId: id } });
  const interestIds = userInterests.map((ui: any) => ui.interestId);
  // Get posts by users with shared interests
  const posts = await prisma.post.findMany({
    where: {
      user: {
        userInterests: {
          some: {
            interestId: { in: interestIds }
          }
        }
      }
    },
    include: {
      user: true,
      likes: true,
      comments: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
};