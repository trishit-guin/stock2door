import express from 'express';
import authRoutes from './auth';
import vehicleRoutes from './vehicle';
import deliveryRoutes from './delivery';
import routeRoutes from './route';
import clusterRoutes from './cluster';
import emissionRoutes from './emission';
import analyticsRoutes from './analytics';
import simulationRoutes from './simulation';
import bulkRoutes from './bulk';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/v1/vehicles', vehicleRoutes);
router.use('/v1/deliveries', deliveryRoutes);
router.use('/v1/optimize-route', routeRoutes);
router.use('/v1/cluster-deliveries', clusterRoutes);
router.use('/v1/emissions', emissionRoutes);
router.use('/v1/analytics', analyticsRoutes);
router.use('/v1/admin', simulationRoutes);
router.use('/v1/bulk', bulkRoutes);

export default router; 