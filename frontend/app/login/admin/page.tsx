'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/app/hooks/useAuth';
import { useAuth } from '@/app/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { UserRole } from '@/types';
import { loginSchema, LoginFormData } from '@/lib/schemas';

const  AdminLoginPage = () =>  {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { mutateAsync: login, isPending, error } = useLogin();
  const [accessError, setAccessError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === UserRole.SUPER_ADMIN) router.replace('/admin');
    else if (user?.role === UserRole.MINI_ADMIN) router.replace('/mini-admin');
    else if (user?.role === UserRole.USER) router.replace('/');
  }, [isLoading, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    delayError: 300,
  });

  const onSubmit = async (data: LoginFormData) => {
    setAccessError('');
    try {
      const result = await login(data);
      const role = result.user.role;
      if (role === UserRole.SUPER_ADMIN) {
        router.push('/admin');
      } else if (role === UserRole.MINI_ADMIN) {
        router.push('/mini-admin');
      } else {
        setAccessError('This account does not have admin privileges.');
      }
    } catch {
      // shown via apiError
    }
  };

  const apiError = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed'
    : null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mini Admin &amp; Main Admin sign in here</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
              {...register('password')}
            />

            {(apiError ?? accessError) && (
              <p className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-400">
                {accessError || apiError}
              </p>
            )}

            <Button type="submit" loading={isPending} variant="secondary" className="w-full mt-1">
              Sign in as Admin
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AdminLoginPage;