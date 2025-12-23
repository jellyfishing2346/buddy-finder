import express from 'express';
import { getExploreFeed } from '../controllers/exploreController';

const router = express.Router();

router.get('/', getExploreFeed);

export default router;
