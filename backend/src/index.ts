import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Minimal Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Minimal Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});
// All other routes are commented out for debugging
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => {
    console.log('Server closed');
  });
});