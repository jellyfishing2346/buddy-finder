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
  getFollowing
} from '../controllers/userController';

const router = express.Router();
// Update user profile
router.put('/:id', authenticate, updateUserProfile);


router.post('/:id/follow', authenticate, followUser);
router.post('/:id/unfollow', authenticate, unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

// Interest selection
router.post('/:id/interests', authenticate, selectInterests);
router.get('/:id/interests', authenticate, getUserInterests);

// Matching and feed
router.get('/:id/matches', authenticate, getMatchedUsers);
router.get('/:id/interest-feed', authenticate, getInterestFeed);

export default router;
