import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { globalRateLimiter } from './src/middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './src/middleware/error.middleware';
import { logger } from './src/utils/logger';
import { env } from './src/config/env';
import apiRoutes from './src/routes';

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Static Files ────────────────────────────────────────────────────────────────
// Must come BEFORE compression and rate-limiting so that video range requests
// (206 Partial Content) are served directly without interference.
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('Accept-Ranges', 'bytes');
    },
  })
);

// ─── Performance Middleware ─────────────────────────────────────────────────────
app.use(compression());
app.use(globalRateLimiter);

// ─── Logging ────────────────────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: () => env.NODE_ENV === 'test',
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
