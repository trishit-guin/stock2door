import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { query } from 'express-validator';
import { getEmissions } from '../controllers/emissionController';

const router = express.Router();

// Get emissions/fuel metrics
router.get('/metrics',
  authenticateJWT,
  query('routeId').optional().isString(),
  query('vehicleId').optional().isString(),
  getEmissions
);

export default router; 