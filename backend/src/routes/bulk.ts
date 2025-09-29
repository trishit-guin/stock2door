import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { bulkUpload, exportPlan } from '../controllers/bulkController';

const router = express.Router();

// Bulk upload CSV
router.post('/upload', authenticateJWT, bulkUpload);

// Export optimized plan
router.get('/export', authenticateJWT, exportPlan);

export default router; 