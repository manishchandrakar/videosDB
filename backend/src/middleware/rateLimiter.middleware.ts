import rateLimit from 'express-rate-limit';
import { CONSTANTS, HTTP_STATUS } from '../constants';

const createLimiter = (max: number, message: string): ReturnType<typeof rateLimit> =>
  rateLimit({
    windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
    max,
    message: { success: false, statusCode: HTTP_STATUS.TOO_MANY_REQUESTS, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const globalRateLimiter = createLimiter(
  CONSTANTS.RATE_LIMIT_MAX,
  'Too many requests, please try again later'
);

export const authRateLimiter = createLimiter(
  CONSTANTS.AUTH_RATE_LIMIT_MAX,
  'Too many login attempts, please try again in 15 minutes'
);

export const uploadRateLimiter = createLimiter(
  CONSTANTS.UPLOAD_RATE_LIMIT_MAX,
  'Upload limit reached, please try again later'
);
