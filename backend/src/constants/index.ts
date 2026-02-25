export const CONSTANTS = {
  // JWT
  JWT_ACCESS_EXPIRES: '15m',
  JWT_REFRESH_EXPIRES: '7d',

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,

  // Upload
  MAX_VIDEO_SIZE_MB: 500,
  MAX_THUMBNAIL_SIZE_MB: 5,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // FTP paths
  FTP_VIDEO_DIR: '/public_html/videos',
  FTP_THUMBNAIL_DIR: '/public_html/thumbnails',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 10,
  UPLOAD_RATE_LIMIT_MAX: 5,

  // Suggestions
  SUGGESTION_LIMIT: 10,
} as const;

export const REGEX = {
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  TAG: /^[a-zA-Z0-9\-_. ]{1,50}$/,
  OBJECT_ID: /^[a-z0-9]{25}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  VIDEO_TITLE: /^[a-zA-Z0-9\s\-_.,!?'"():&]{3,200}$/,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden: insufficient permissions',
  NOT_FOUND: (resource: string): string => `${resource} not found`,
  ALREADY_EXISTS: (resource: string): string => `${resource} already exists`,
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  UPLOAD_FAILED: 'File upload failed',
  VALIDATION_FAILED: 'Validation failed',
} as const;
