import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// POST /api/users/:id/follow
export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // user to follow
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (id === userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if user to follow exists
    const userToFollow = await prisma.user.findUnique({ where: { id } });
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: id
        }
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    
    await prisma.follow.create({
      data: { followerId: userId, followingId: id }
    });
    
    res.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

// POST /api/users/:id/unfollow
export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (id === userId) {
      return res.status(400).json({ error: 'Cannot unfollow yourself' });
    }
    
    await prisma.follow.deleteMany({
      where: { followerId: userId, followingId: id }
    });
    
    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

// GET /api/users/:id/followers
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: { 
        follower: { 
          select: { 
            id: true, 
            username: true, 
            profilePictureUrl: true,
            fullName: true
          } 
        } 
      },
    });
    
    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

// GET /api/users/:id/following
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: { 
        following: { 
          select: { 
            id: true, 
            username: true, 
            profilePictureUrl: true,
            fullName: true
          } 
        } 
      },
    });
    
    res.json(following.map(f => f.following));
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

// PUT /api/users/:id (update profile)
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId || userId !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { fullName, bio, profilePictureUrl, email } = req.body;
    
    // If email is being updated, check if it's already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        bio,
        profilePictureUrl,
        ...(email && { email }),
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

// GET /api/users/:id - Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        profilePictureUrl: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// POST /api/users/:id/interests
export const selectInterests = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { interests } = req.body; // [{ interestId, weight }]
    
    if (!userId || userId !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: 'Invalid interests format' });
    }
    
    // Delete existing interests
    await prisma.userInterest.deleteMany({ where: { userId: id } });
    
    // Create new interests
    if (interests.length > 0) {
      await prisma.userInterest.createMany({
        data: interests.map((i: { interestId: string, weight?: number }) => ({
          userId: id,
          interestId: i.interestId,
          weight: i.weight ?? 1
        }))
      });
    }
    
    res.json({ success: true, message: 'Interests updated successfully' });
  } catch (error) {
    console.error('Select interests error:', error);
    res.status(500).json({ error: 'Failed to update interests' });
  }
};

// GET /api/users/:id/interests
export const getUserInterests = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const interests = await prisma.userInterest.findMany({
      where: { userId: id },
      include: { interest: true }
    });
    
    res.json(interests);
  } catch (error) {
    console.error('Get user interests error:', error);
    res.status(500).json({ error: 'Failed to fetch user interests' });
  }
};

// GET /api/users/:id/matches
export const getMatchedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get current user's interests
    const userInterests = await prisma.userInterest.findMany({ 
      where: { userId: id } 
    });
    
    if (userInterests.length === 0) {
      return res.json([]);
    }
    
    const interestIds = userInterests.map((ui: { interestId: string }) => ui.interestId);
    
    // Find other users with shared interests
    const matches = await prisma.userInterest.findMany({
      where: {
        interestId: { in: interestIds },
        userId: { not: id }
      },
      include: { 
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            bio: true
          }
        }
      }
    });
    
    // Aggregate by user and score
    const scores: Record<string, { user: any, score: number }> = {};
    matches.forEach((m: { userId: string, user: any, weight: number }) => {
      if (!scores[m.userId]) {
        scores[m.userId] = { user: m.user, score: 0 };
      }
      scores[m.userId].score += m.weight;
    });
    
    const result = Object.values(scores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Limit to top 20 matches
    
    res.json(result);
  } catch (error) {
    console.error('Get matched users error:', error);
    res.status(500).json({ error: 'Failed to fetch matched users' });
  }
};

// GET /api/users/:id/interest-feed
export const getInterestFeed = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user's interests
    const userInterests = await prisma.userInterest.findMany({ 
      where: { userId: id } 
    });
    
    if (userInterests.length === 0) {
      return res.json([]);
    }
    
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
        user: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            fullName: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Get interest feed error:', error);
    res.status(500).json({ error: 'Failed to fetch interest feed' });
  }
};