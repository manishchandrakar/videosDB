'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@/types';
import { QUERY_KEYS } from '@/constants';
import { useAuth as useAuthContext } from '@/app/context/AuthContext';

// Re-export context hook for convenience
export { useAuth } from '@/app/context/AuthContext';

// Fetch current user from server (used after login to get full profile)
export function useMe() {
  const { isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: authService.me,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 15, // 15 min
  });
}

export function useLogin() {
  const { login } = useAuthContext();
  return useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
  });
}

export function useLogout() {
  const { logout } = useAuthContext();
  return useMutation({
    mutationFn: async () => {
      logout();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authService.changePassword(input),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: authService.getUsers,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authService.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}
