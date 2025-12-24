import express from 'express';
import { createStory, getStories, deleteStory } from '../controllers/storyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All story routes require authentication
router.use(authenticate);

router.post('/', createStory);
router.get('/', getStories);
router.delete('/:storyId', deleteStory);

export default router;