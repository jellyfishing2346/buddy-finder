import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Create a new story
export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { mediaUrl, mediaType, caption } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!mediaUrl || !mediaType) {
      return res.status(400).json({ error: 'mediaUrl and mediaType are required' });
    }
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const story = await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        mediaType,
        caption,
        createdAt: now,
        expiresAt,
      },
    });
    
    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

// Get all active stories for a user and their followings
export const getStories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user's followings
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    
    const userIds = [userId, ...following.map(f => f.followingId)];
    const now = new Date();
    
    const stories = await prisma.story.findMany({
      where: {
        userId: { in: userIds },
        expiresAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { 
          select: { 
            id: true, 
            username: true, 
            profilePictureUrl: true 
          } 
        } 
      },
    });
    
    res.json(stories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Delete a story (only by owner)
export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { storyId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const story = await prisma.story.findUnique({ 
      where: { id: storyId } 
    });
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    if (story.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this story' });
    }
    
    await prisma.story.delete({ where: { id: storyId } });
    
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};