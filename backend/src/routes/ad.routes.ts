import { Router } from 'express';
import { getActiveAds, getAllAds, createAd, toggleAdStatus, deleteAd } from '../controllers/ad.controller';
import { authenticate, superAdminOnly } from '../middleware/auth.middleware';
import { uploadThumbnail } from '../middleware/upload.middleware';

const router = Router();

// ─── Public ────────────────────────────────────────────────────────────────────
router.get('/active', getActiveAds);

// ─── Super Admin Only ──────────────────────────────────────────────────────────
router.get('/', authenticate, superAdminOnly, getAllAds);
router.post('/', authenticate, superAdminOnly, uploadThumbnail, createAd);
router.patch('/:id/status', authenticate, superAdminOnly, toggleAdStatus);
router.delete('/:id', authenticate, superAdminOnly, deleteAd);

export default router;
