import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { body } from 'express-validator';
import { optimizeRoute } from '../controllers/routeController';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Route optimization service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      optimize: '/api/v1/optimize-route/optimize',
      testOptimize: '/api/v1/optimize-route/test-optimize'
    }
  });
});

// Test route optimization (no auth required for testing)
router.post('/test-optimize', optimizeRoute);

// Optimize route
router.post('/optimize',
  authenticateJWT,
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('vehicleType').optional().isIn(['LCV', 'MCV', 'HCV', 'THREE_WHEELER']),
  body('fuelType').optional().isIn(['DIESEL', 'PETROL', 'CNG', 'ELECTRIC']),
  optimizeRoute
);

export default router; 