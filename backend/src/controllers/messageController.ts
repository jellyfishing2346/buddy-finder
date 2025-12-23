import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new conversation (between two users)
export const createConversation = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body; // [userId1, userId2]
    if (!userIds || userIds.length < 2) {
      return res.status(400).json({ error: 'userIds array of length 2 required' });
    }
    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: { id: { in: userIds } },
        },
      },
    });
    if (existing) return res.json(existing);
    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: (userIds as string[]).map((id: string) => ({ id })),
        },
      },
      include: { participants: true },
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// Send a message in a conversation
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, content, mediaUrl } = req.body;
    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ error: 'conversationId, senderId, and content required' });
    }
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        mediaUrl,
      },
      include: { sender: true },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all conversations for a user
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId as string },
        },
      },
      include: { participants: true, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get messages for a conversation
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, username: true, profilePictureUrl: true } } },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
