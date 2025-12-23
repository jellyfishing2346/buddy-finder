import express from 'express';
import { createConversation, sendMessage, getConversations, getMessages } from '../controllers/messageController';
// import { authenticate } from '../middleware/auth'; // Uncomment if you have auth middleware

const router = express.Router();

// router.use(authenticate); // Protect all routes if you have auth middleware

router.post('/conversation', createConversation);
router.get('/conversations', getConversations);
router.post('/message', sendMessage);
router.get('/messages/:conversationId', getMessages);

export default router;
