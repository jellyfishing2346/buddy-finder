import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  followUser,
  unfollowUser,
  selectInterests,
  getUserInterests,
  getMatchedUsers,
  getInterestFeed,
  updateUserProfile,
  getFollowers,
  getFollowing,
  getUserProfile
} from '../controllers/userController';

const router = express.Router();

// Public routes (no authentication required)
router.get('/:id', getUserProfile);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/interests', getUserInterests);

// Protected routes (authentication required)
router.put('/:id', authenticate, updateUserProfile);
router.post('/:id/follow', authenticate, followUser);
router.post('/:id/unfollow', authenticate, unfollowUser);
router.post('/:id/interests', authenticate, selectInterests);
router.get('/:id/matches', authenticate, getMatchedUsers);
router.get('/:id/interest-feed', authenticate, getInterestFeed);

export default router;