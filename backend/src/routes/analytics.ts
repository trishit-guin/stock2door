import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { getDashboardKPIs, getFleetStatus, getRecentActivities, getTimeSeriesData, getRouteEfficiencyAnalysis } from '../controllers/analyticsController';

const router = express.Router();

// Get dashboard KPIs
router.get('/dashboard', authenticateJWT, getDashboardKPIs);

// Get fleet status and statistics
router.get('/fleet-status', authenticateJWT, getFleetStatus);

// Get recent activities
router.get('/recent-activities', authenticateJWT, getRecentActivities);

// Get time-series data for charts
router.get('/time-series', authenticateJWT, getTimeSeriesData);

// Get route efficiency analysis
router.get('/route-efficiency', authenticateJWT, getRouteEfficiencyAnalysis);

export default router; 