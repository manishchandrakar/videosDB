'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { VideoQuery, VideoUpdateInput } from '@/types';
import { QUERY_KEYS } from '@/constants';

// ─── Public hooks ─────────────────────────────────────────────────────────────
export function useVideos(query?: VideoQuery) {
  return useQuery({
    queryKey: [...QUERY_KEYS.VIDEOS, query],
    queryFn: () => videoService.getVideos(query),
    placeholderData: keepPreviousData,
  });
}

export function useVideoBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.VIDEO_BY_SLUG(slug),
    queryFn: () => videoService.getVideoBySlug(slug),
    enabled: !!slug,
  });
}

export function useVideoSuggestions(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.VIDEO_SUGGESTIONS(id),
    queryFn: () => videoService.getSuggestions(id),
    enabled: !!id,
  });
}

export function useSearchVideos(q: string, tags?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.VIDEOS_SEARCH(q, tags),
    queryFn: () => videoService.searchVideos(q, tags),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
  });
}

// ─── Admin hooks ──────────────────────────────────────────────────────────────
export function useAdminVideos(query?: VideoQuery) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_VIDEOS, query],
    queryFn: () => videoService.getAllVideosAdmin(query),
    placeholderData: keepPreviousData,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: videoService.getDashboard,
  });
}

export function useUploadVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => videoService.uploadVideo(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VideoUpdateInput }) =>
      videoService.updateVideo(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_BY_ID(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
    },
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => videoService.deleteVideo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
}

export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => videoService.toggleStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
    },
  });
}
