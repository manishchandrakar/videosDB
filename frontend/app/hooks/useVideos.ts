'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { VideoQuery, VideoUpdateInput } from '@/types';
import { QUERY_KEYS, DEFAULT_LIMIT } from '@/constants';
import { toastError, toastSuccess } from '@/utils/toast';

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

export function useInfiniteVideos(query?: Omit<VideoQuery, 'page' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.VIDEOS, 'infinite', query],
    queryFn: ({ pageParam }) =>
      videoService.getVideos({ ...query, page: pageParam, limit: DEFAULT_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
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

export function useInfiniteAdminVideos(query?: Omit<VideoQuery, 'page' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.ADMIN_VIDEOS, 'infinite', query],
    queryFn: ({ pageParam }) =>
      videoService.getAllVideosAdmin({ ...query, page: pageParam, limit: DEFAULT_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
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
      toastSuccess('Video uploaded successfully.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
    onError: toastError,
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VideoUpdateInput }) =>
      videoService.updateVideo(id, input),
    onSuccess: (_data, { id }) => {
      toastSuccess('Video updated.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_BY_ID(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
    },
    onError: toastError,
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => videoService.deleteVideo(id),
    onSuccess: () => {
      toastSuccess('Video deleted.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
    onError: toastError,
  });
}

export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => videoService.toggleStatus(id),
    onSuccess: () => {
      toastSuccess('Status updated.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VIDEOS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS });
    },
    onError: toastError,
  });
}
