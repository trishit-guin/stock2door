import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { body } from 'express-validator';
import { getAllDeliveries, createDelivery, updateDelivery, deleteDelivery } from '../controllers/deliveryController';

const router = express.Router();

// Get all deliveries
router.get('/', authenticateJWT, getAllDeliveries);

// Create delivery
router.post('/',
  authenticateJWT,
  roleMiddleware(['admin', 'logistics_manager']),
  body('source').notEmpty(),
  body('destinations').isArray({ min: 1 }),
  body('vehicle').notEmpty(),
  body('status').notEmpty(),
  body('scheduledAt').notEmpty(),
  createDelivery
);

// Update delivery
router.put('/:id',
  authenticateJWT,
  roleMiddleware(['admin', 'logistics_manager']),
  body('source').optional().notEmpty(),
  body('destinations').optional().isArray({ min: 1 }),
  body('vehicle').optional().notEmpty(),
  body('status').optional().notEmpty(),
  body('scheduledAt').optional().notEmpty(),
  updateDelivery
);

// Delete delivery
router.delete('/:id', authenticateJWT, roleMiddleware(['admin', 'logistics_manager']), deleteDelivery);

export default router; 