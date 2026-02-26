// ─── Enums ────────────────────────────────────────────────────────────────────
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MINI_ADMIN = 'MINI_ADMIN',
  USER = 'USER',
}

export enum PublishStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export const VIDEO_CATEGORIES = [
  'Entertainment',
  'Education',
  'Technology',
  'Gaming',
  'Finance',
  'Lifestyle',
] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];

// ─── API Response ──────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  userId: string;
  id?: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
  tokens: IAuthTokens;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ─── Video ────────────────────────────────────────────────────────────────────
export interface Video {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string | null;
  status: PublishStatus;
  uploadedBy: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVideos {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VideoQuery {
  search?: string;
  category?: string;
  tags?: string[];
  status?: PublishStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface VideoSuggestion {
  videos: Video[];
  reason: 'tag_match' | 'title_match' | 'latest' | 'trending';
}

export interface VideoUpdateInput {
  title?: string;
  category?: string | null;
  tags?: string[];
  thumbnailUrl?: string;
  status?: PublishStatus;
}

export interface DashboardStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalViews: number;
  recentUploads: Video[];
}

// ─── Users (admin) ────────────────────────────────────────────────────────────
export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: UserRole.SUPER_ADMIN | UserRole.MINI_ADMIN;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}
