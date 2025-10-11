import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { body } from 'express-validator';
import { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController';

const router = express.Router();

// Health check endpoint for vehicles
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vehicle service is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint - Get all vehicles (no auth for testing)
router.get('/test', getAllVehicles);

// Test endpoint - Create vehicle (no auth for testing)
router.post('/test',
  body('type').notEmpty(),
  body('make').notEmpty(),
  body('model').notEmpty(),
  body('year').isInt({ min: 1900 }),
  body('fuelType').notEmpty(),
  body('vehicleNumber').notEmpty(),
  createVehicle
);

// Get all vehicles
router.get('/', authenticateJWT, getAllVehicles);

// Get vehicle by ID
router.get('/:id', authenticateJWT, getVehicleById);

// Create vehicle
router.post('/',
  authenticateJWT,
  roleMiddleware(['admin', 'logistics_manager']),
  body('type').notEmpty(),
  body('make').notEmpty(),
  body('model').notEmpty(),
  body('year').isInt({ min: 1900 }),
  body('fuelType').notEmpty(),
  body('vehicleNumber').notEmpty(),
  body('capacity').optional().isNumeric(),
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
  body('vehicleNumber').optional().notEmpty(),
  body('capacity').optional().isNumeric(),
  updateVehicle
);

// Delete vehicle
router.delete('/:id', authenticateJWT, roleMiddleware(['admin', 'logistics_manager']), deleteVehicle);

export default router; 