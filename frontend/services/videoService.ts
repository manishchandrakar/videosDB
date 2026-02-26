import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  Video,
  PaginatedVideos,
  VideoQuery,
  VideoSuggestion,
  VideoUpdateInput,
  DashboardStats,
} from '@/types';

export const videoService = {
  // ─── Public ──────────────────────────────────────────────────────────────────
  getVideos: async (query?: VideoQuery): Promise<PaginatedVideos> => {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.category) params.set('category', query.category);
    if (query?.tags?.length) params.set('tags', query.tags.join(','));
    if (query?.status) params.set('status', query.status);
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.sortBy) params.set('sortBy', query.sortBy);
    if (query?.sortOrder) params.set('sortOrder', query.sortOrder);

    const { data } = await axiosInstance.get<ApiResponse<PaginatedVideos>>(
      `/videos?${params.toString()}`
    );
    return data.data!;
  },

  getVideoBySlug: async (slug: string): Promise<Video> => {
    const { data } = await axiosInstance.get<ApiResponse<Video>>(`/videos/slug/${slug}`);
    return data.data!;
  },

  getSuggestions: async (id: string): Promise<VideoSuggestion> => {
    const { data } = await axiosInstance.get<ApiResponse<VideoSuggestion>>(
      `/videos/${id}/suggestions`
    );
    return data.data!;
  },

  searchVideos: async (q: string, tags?: string): Promise<PaginatedVideos> => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tags) params.set('tags', tags);

    const { data } = await axiosInstance.get<ApiResponse<PaginatedVideos>>(
      `/videos/search?${params.toString()}`
    );
    return data.data!;
  },

  // ─── Admin ────────────────────────────────────────────────────────────────────
  getAllVideosAdmin: async (query?: VideoQuery): Promise<PaginatedVideos> => {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.status) params.set('status', query.status);
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));

    const { data } = await axiosInstance.get<ApiResponse<PaginatedVideos>>(
      `/videos/admin/all?${params.toString()}`
    );
    return data.data!;
  },

  getVideoByIdAdmin: async (id: string): Promise<Video> => {
    const { data } = await axiosInstance.get<ApiResponse<Video>>(`/videos/admin/${id}`);
    return data.data!;
  },

  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await axiosInstance.get<ApiResponse<DashboardStats>>(
      '/videos/admin/dashboard'
    );
    return data.data!;
  },

  uploadVideo: async (formData: FormData): Promise<Video> => {
    const { data } = await axiosInstance.post<ApiResponse<Video>>('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data!;
  },

  updateVideo: async (id: string, input: VideoUpdateInput): Promise<Video> => {
    const { data } = await axiosInstance.patch<ApiResponse<Video>>(`/videos/${id}`, input);
    return data.data!;
  },

  deleteVideo: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/videos/${id}`);
  },

  toggleStatus: async (id: string): Promise<Video> => {
    const { data } = await axiosInstance.patch<ApiResponse<Video>>(`/videos/${id}/status`);
    return data.data!;
  },
};
