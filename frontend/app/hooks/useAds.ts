'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adService } from '@/services/adService';
import { QUERY_KEYS } from '@/constants';
import { toastError, toastSuccess } from '@/utils/toast';

export function useActiveAds(placement: 'home' | 'sidebar') {
  return useQuery({
    queryKey: QUERY_KEYS.ADS_ACTIVE(placement),
    queryFn: () => adService.getActiveAds(placement),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllAds() {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADS],
    queryFn: () => adService.getAllAds(),
  });
}

export function useCreateAd() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => adService.createAd(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADS });
      toastSuccess('Ad created');
    },
    onError: () => toastError('Failed to create ad'),
  });
}

export function useToggleAdStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adService.toggleAdStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADS });
      toastSuccess('Ad status updated');
    },
    onError: () => toastError('Failed to update ad'),
  });
}

export function useDeleteAd() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adService.deleteAd(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADS });
      toastSuccess('Ad deleted');
    },
    onError: () => toastError('Failed to delete ad'),
  });
}
