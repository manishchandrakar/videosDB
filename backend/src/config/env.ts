import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optionalEnv = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const env = {
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),

  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // JWT
  JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),

  // Storage mode: 'local' for development, 'ftp' for InterServer production
  STORAGE_MODE: optionalEnv('STORAGE_MODE', 'local') as 'local' | 'ftp',

  // InterServer FTP (required only when STORAGE_MODE=ftp)
  FTP_HOST: optionalEnv('FTP_HOST', ''),
  FTP_USER: optionalEnv('FTP_USER', ''),
  FTP_PASSWORD: optionalEnv('FTP_PASSWORD', ''),
  FTP_PORT: parseInt(optionalEnv('FTP_PORT', '21'), 10),
  FTP_SECURE: optionalEnv('FTP_SECURE', 'false') === 'true',
  FTP_UPLOAD_BASE_PATH: optionalEnv('FTP_UPLOAD_BASE_PATH', '/public_html'),
  PUBLIC_BASE_URL: optionalEnv('PUBLIC_BASE_URL', 'http://localhost:5000'),

  // Admin
  ADMIN_ROUTE_SECRET: requireEnv('ADMIN_ROUTE_SECRET'),

  // CORS
  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', 'http://localhost:3000'),
} as const;

export type IEnv = typeof env;
