import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { body, query } from 'express-validator';
import { clusterDeliveries } from '../controllers/clusterController';

const router = express.Router();

// Cluster deliveries
router.post('/cluster',
  authenticateJWT,
  body('deliveryPoints').isArray({ min: 2 }),
  clusterDeliveries
);

export default router; 