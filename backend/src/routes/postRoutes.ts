import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  deletePost,
  likePost,
  commentOnPost
} from '../controllers/postController';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUser);
router.delete('/:postId', authenticate, deletePost);
router.post('/:postId/like', authenticate, likePost);
router.post('/:postId/comment', authenticate, commentOnPost);

export default router;
