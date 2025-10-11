import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { getDashboardKPIs, getFleetStatus, getRecentActivities } from '../controllers/analyticsController';

const router = express.Router();

// Get dashboard KPIs
router.get('/dashboard', authenticateJWT, getDashboardKPIs);

// Get fleet status and statistics
router.get('/fleet-status', authenticateJWT, getFleetStatus);

// Get recent activities
router.get('/recent-activities', authenticateJWT, getRecentActivities);

export default router; 