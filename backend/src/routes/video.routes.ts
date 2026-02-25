import { Router } from 'express';
import {
  getVideos,
  getVideoBySlug,
  getVideoById,
  getVideoSuggestions,
  uploadVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getDashboard,
  searchVideos,
} from '../controllers/video.controller';
import { authenticate, adminOrMiniAdmin, superAdminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { uploadRateLimiter } from '../middleware/rateLimiter.middleware';
import { uploadVideoWithThumbnail } from '../middleware/upload.middleware';
import {
  createVideoSchema,
  updateVideoSchema,
  videoQuerySchema,
} from '../validators/video.validator';

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', validate(videoQuerySchema, 'query'), getVideos);
router.get('/search', searchVideos);
router.get('/slug/:slug', getVideoBySlug);
router.get('/:id/suggestions', getVideoSuggestions);

// ─── Admin Routes (Super + Mini) ───────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  adminOrMiniAdmin,
  uploadRateLimiter,
  uploadVideoWithThumbnail,
  validate(createVideoSchema),
  uploadVideo
);

// ─── Admin Routes (Super Admin only) ──────────────────────────────────────────
router.get(
  '/admin/all',
  authenticate,
  adminOrMiniAdmin,
  validate(videoQuerySchema, 'query'),
  getVideos
);
router.get('/admin/dashboard', authenticate, superAdminOnly, getDashboard);
router.get('/admin/:id', authenticate, superAdminOnly, getVideoById);
router.patch('/:id', authenticate, superAdminOnly, validate(updateVideoSchema), updateVideo);
router.delete('/:id', authenticate, superAdminOnly, deleteVideo);
router.patch('/:id/status', authenticate, superAdminOnly, togglePublishStatus);

export default router;
