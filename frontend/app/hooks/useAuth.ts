'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { ChangePasswordInput, LoginInput, RegisterInput, SignupInput } from '@/types';
import { QUERY_KEYS } from '@/constants';
import { useAuth as useAuthContext } from '@/app/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';

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
    // Login errors are shown inline on the form, not as toasts
  });
}

export function useSignup() {
  const { signup } = useAuthContext();
  return useMutation({
    mutationFn: (input: SignupInput) => signup(input),
    // Signup errors are shown inline on the form
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
    onSuccess: () => toastSuccess('Password changed successfully.'),
    onError: toastError,
  });
}

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: authService.getUsers,
    enabled,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: () => {
      toastSuccess('User created successfully.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: toastError,
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authService.deleteUser(id),
    onSuccess: () => {
      toastSuccess('User deleted.');
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: toastError,
  });
}

export function useToggleBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authService.toggleBlock(id),
    onSuccess: (user) => {
      toastSuccess(`User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: toastError,
  });
}
