export const QUERY_KEYS = {
  // Auth
  ME: ['me'] as const,
  // Videos
  VIDEOS: ['videos'] as const,
  VIDEO_BY_SLUG: (slug: string) => ['videos', 'slug', slug] as const,
  VIDEO_BY_ID: (id: string) => ['videos', 'id', id] as const,
  VIDEO_SUGGESTIONS: (id: string) => ['videos', 'suggestions', id] as const,
  VIDEOS_SEARCH: (q: string, tags?: string) => ['videos', 'search', q, tags] as const,
  ADMIN_VIDEOS: ['admin', 'videos'] as const,
  DASHBOARD: ['admin', 'dashboard'] as const,
  USERS: ['admin', 'users'] as const,
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;

// Used by utils.ts
export const MAX_FILE_SIZE = 1024 * 1024; // 1 MB
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicklime'];
