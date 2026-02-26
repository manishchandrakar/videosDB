import { Router } from 'express';
import { login, register, refreshTokens, changePassword, me, getUsers, deleteUser, toggleBlock } from '../controllers/auth.controller';
import { validate, authenticate, superAdminOnly, adminOrMiniAdmin } from '../middleware';
import { loginSchema, registerSchema, changePasswordSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { refreshTokenSchema } from '../validators/common.validator';

const router = Router();

// Public
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshTokens);

// Protected
router.get('/me', authenticate, me);
router.patch('/change-password', authenticate, validate(changePasswordSchema), changePassword);

// Admin or Mini Admin
router.post('/register', authenticate, adminOrMiniAdmin, validate(registerSchema), register);
router.get('/users', authenticate, adminOrMiniAdmin, getUsers);

// Super admin only
router.delete('/users/:id', authenticate, superAdminOnly, deleteUser);
router.patch('/users/:id/block', authenticate, superAdminOnly, toggleBlock);

export default router;
