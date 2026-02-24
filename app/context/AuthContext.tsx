'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthUser, LoginInput, LoginResponse } from '@/types';
import { authService } from '@/services/authService';
import {
  storeTokens,
  clearStoredTokens,
  getStoredAccessToken,
  decodeToken,
} from '@/utils/tokenUtils';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from stored token on mount
  useEffect(() => {
    const token = getStoredAccessToken();
    if (token) {
      const decoded = decodeToken(token) as AuthUser | null;
      if (decoded) {
        setUser(decoded);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginInput): Promise<LoginResponse> => {
    const result = await authService.login(credentials);
    storeTokens(result.tokens);
    const decoded = decodeToken(result.tokens.accessToken) as AuthUser | null;
    setUser(decoded ?? { ...result.user, userId: result.user.id });
    return result;
  }, []);

  const logout = useCallback(() => {
    clearStoredTokens();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
