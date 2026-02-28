import axiosInstance from '@/lib/axios';
import { ApiResponse, Advertisement } from '@/types';

export const adService = {
  // ─── Public ──────────────────────────────────────────────────────────────────
  getActiveAds: async (placement: 'home' | 'sidebar'): Promise<Advertisement[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Advertisement[]>>(
      `/ads/active?placement=${placement}`
    );
    return data.data ?? [];
  },

  // ─── Super Admin ─────────────────────────────────────────────────────────────
  getAllAds: async (): Promise<Advertisement[]> => {
    const { data } = await axiosInstance.get<ApiResponse<Advertisement[]>>('/ads');
    return data.data ?? [];
  },

  createAd: async (formData: FormData): Promise<Advertisement> => {
    const { data } = await axiosInstance.post<ApiResponse<Advertisement>>('/ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data!;
  },

  toggleAdStatus: async (id: string): Promise<Advertisement> => {
    const { data } = await axiosInstance.patch<ApiResponse<Advertisement>>(`/ads/${id}/status`);
    return data.data!;
  },

  deleteAd: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/ads/${id}`);
  },
};
