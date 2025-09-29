import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { body } from 'express-validator';
import { simulateRouting } from '../controllers/simulationController';

const router = express.Router();

// Adjust routing priorities (admin only)
router.post('/simulate',
  authenticateJWT,
  roleMiddleware(['admin']),
  body('weights').isObject(),
  body('scenario').isObject(),
  simulateRouting
);

export default router; 