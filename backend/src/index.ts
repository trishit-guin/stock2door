import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartRoute backend is running.' });
});

export default app;

// Start server with graceful DB connection handling
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log('Starting server without database connection...');
  }
  
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`SmartRoute backend running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  }
};

startServer();
