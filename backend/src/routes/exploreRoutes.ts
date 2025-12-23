import express from 'express';
import { getExploreFeed, getPostsByHashtag, searchHashtags } from '../controllers/exploreController';

const router = express.Router();

router.get('/', getExploreFeed);
router.get('/hashtags/:tag/posts', getPostsByHashtag);
router.get('/hashtags/search', searchHashtags);

export default router;
