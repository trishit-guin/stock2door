import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { body } from 'express-validator';
import { optimizeRoute } from '../controllers/routeController';

const router = express.Router();

// Optimize route
router.post('/optimize',
  authenticateJWT,
  body('source').notEmpty(),
  body('destinations').isArray({ min: 1 }),
  body('vehicleType').notEmpty(),
  optimizeRoute
);

export default router; 