import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Create a new conversation (between two users)
export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.userId;
    const { otherUserId } = req.body;
    
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required' });
    }
    
    if (currentUserId === otherUserId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }
    
    const userIds = [currentUserId, otherUserId].sort();
    
    // Check if conversation already exists between these two users
    const existingConversations = await prisma.conversation.findMany({
      where: {
        participants: {
          every: {
            id: { in: userIds }
          }
        }
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    // Find conversation with exactly these two participants
    const existing = existingConversations.find(
      conv => conv.participants.length === 2 &&
      conv.participants.every(p => userIds.includes(p.id))
    );
    
    if (existing) {
      return res.json(existing);
    }
    
    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: userIds.map((id: string) => ({ id })),
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            fullName: true
          }
        }
      },
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// Send a message in a conversation
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.userId;
    const { conversationId, content, mediaUrl } = req.body;
    
    if (!senderId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!conversationId || !content) {
      return res.status(400).json({ error: 'conversationId and content are required' });
    }
    
    // Verify sender is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const isParticipant = conversation.participants.some(p => p.id === senderId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'You are not a participant in this conversation' });
    }
    
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        mediaUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            fullName: true
          }
        }
      },
    });
    
    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all conversations for the authenticated user
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            fullName: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get messages for a conversation
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const isParticipant = conversation.participants.some(p => p.id === userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'You are not a participant in this conversation' });
    }
    
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            fullName: true
          }
        }
      },
    });
    
    // Mark messages as read (optional)
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};