import express from 'express';
import { createStory, getStories, deleteStory } from '../controllers/storyController';
// import { authenticate } from '../middleware/auth'; // Uncomment if you have auth middleware

const router = express.Router();

// router.use(authenticate); // Protect all routes if you have auth middleware

router.post('/', createStory);
router.get('/', getStories);
router.delete('/:storyId', deleteStory);

export default router;
