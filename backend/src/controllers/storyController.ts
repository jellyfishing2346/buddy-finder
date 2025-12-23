import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// import dayjs from 'dayjs'; // Removed dayjs import
export const createStory = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Use req.body.userId for now
    const { mediaUrl, mediaType, caption } = req.body;
    const userId = req.body.userId; // Use req.body.userId for now
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
    res.status(500).json({ error: 'Failed to create story' });
  }
};

// Get all active stories for a user and their followings
export const getStories = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    // Get user's own and followings' stories
    const userId = req.body.userId; // Use req.body.userId instead of req.query.userId
      where: { followerId: userId },
      select: { followingId: true },
    });
    const userIds = [userId, ...following.map(f => f.followingId)];
    const now = new Date();
    const stories = await prisma.story.findMany({
      where: {
        userId: { in: userIds },
        createdAt: { lte: now },
        expiresAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, username: true, profilePictureUrl: true } } },
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Delete a story (only by owner)
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { storyId } = req.params;
    const userId = req.body.userId; // Use req.body.userId only
    if (!story || story.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.story.delete({ where: { id: storyId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
};
