import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartRoute backend is running.' });
});

export default app;

connectDB().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`SmartRoute backend running on port ${PORT}`);
    });
  }
});
