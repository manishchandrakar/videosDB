import { Router } from 'express';
import { login, signup, register, refreshTokens, changePassword, me, getUsers, deleteUser, toggleBlock } from '../controllers/auth.controller';
import { validate, authenticate, superAdminOnly } from '../middleware';
import { loginSchema, signupSchema, registerSchema, changePasswordSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { refreshTokenSchema } from '../validators/common.validator';

const router = Router();

// Public
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/signup', authRateLimiter, validate(signupSchema), signup);
router.post('/refresh', validate(refreshTokenSchema), refreshTokens);

// Protected
router.get('/me', authenticate, me);
router.patch('/change-password', authenticate, validate(changePasswordSchema), changePassword);

// Super admin only
router.post('/register', authenticate, superAdminOnly, validate(registerSchema), register);
router.get('/users', authenticate, superAdminOnly, getUsers);
router.delete('/users/:id', authenticate, superAdminOnly, deleteUser);
router.patch('/users/:id/block', authenticate, superAdminOnly, toggleBlock);

export default router;
