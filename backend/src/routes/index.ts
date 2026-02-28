import { Router } from 'express';
import authRoutes from './auth.routes';
import videoRoutes from './video.routes';
import adRoutes from './ad.routes';
import { env } from '../config/env';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/videos', videoRoutes);
router.use('/ads', adRoutes);

// Hidden admin login route (security through obscurity + token auth)
router.use(`/${env.ADMIN_ROUTE_SECRET}/auth`, authRoutes);

export default router;
