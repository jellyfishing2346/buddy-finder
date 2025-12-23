import express from 'express';
import upload from '../utils/upload';

const router = express.Router();

// POST /api/upload - handle image/video upload
router.post('/', upload.single('media'), (req, res) => {
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the file path or URL
  res.json({ url: `/uploads/${file.filename}` });
});

export default router;
