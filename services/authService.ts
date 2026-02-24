import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  LoginInput,
  LoginResponse,
  AuthUser,
  IAuthTokens,
  ChangePasswordInput,
  UserPublic,
  RegisterInput,
} from '@/types';

export const authService = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return data.data!;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data!;
  },

  refreshTokens: async (refreshToken: string): Promise<IAuthTokens> => {
    const { data } = await axiosInstance.post<ApiResponse<IAuthTokens>>('/auth/refresh', {
      refreshToken,
    });
    return data.data!;
  },

  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await axiosInstance.patch('/auth/change-password', input);
  },

  register: async (input: RegisterInput): Promise<UserPublic> => {
    const { data } = await axiosInstance.post<ApiResponse<UserPublic>>('/auth/register', input);
    return data.data!;
  },

  getUsers: async (): Promise<UserPublic[]> => {
    const { data } = await axiosInstance.get<ApiResponse<UserPublic[]>>('/auth/users');
    return data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/auth/users/${id}`);
  },
};
