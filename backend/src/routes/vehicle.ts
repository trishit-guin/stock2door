import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { body } from 'express-validator';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController';

const router = express.Router();

// Get all vehicles
router.get('/', authenticateJWT, getAllVehicles);

// Create vehicle
router.post('/',
  authenticateJWT,
  roleMiddleware(['admin', 'logistics_manager']),
  body('type').notEmpty(),
  body('make').notEmpty(),
  body('model').notEmpty(),
  body('year').isInt({ min: 1900 }),
  body('fuelType').notEmpty(),
  body('capacity').isNumeric(),
  body('range').isNumeric(),
  body('emissionsFactor').isNumeric(),
  createVehicle
);

// Update vehicle
router.put('/:id',
  authenticateJWT,
  roleMiddleware(['admin', 'logistics_manager']),
  body('type').optional().notEmpty(),
  body('make').optional().notEmpty(),
  body('model').optional().notEmpty(),
  body('year').optional().isInt({ min: 1900 }),
  body('fuelType').optional().notEmpty(),
  body('capacity').optional().isNumeric(),
  body('range').optional().isNumeric(),
  body('emissionsFactor').optional().isNumeric(),
  updateVehicle
);

// Delete vehicle
router.delete('/:id', authenticateJWT, roleMiddleware(['admin', 'logistics_manager']), deleteVehicle);

export default router; 