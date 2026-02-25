export interface IApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface IApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string>[];
  stack?: string;
}

export interface IDashboardStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalAdmins: number;
}
