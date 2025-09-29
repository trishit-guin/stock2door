import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { getDashboardKPIs } from '../controllers/analyticsController';

const router = express.Router();

// Get dashboard KPIs
router.get('/dashboard', authenticateJWT, getDashboardKPIs);

export default router; 