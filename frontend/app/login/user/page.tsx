'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/app/hooks/useAuth';
import { useAuth } from '@/app/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { UserRole } from '@/types';
import { loginSchema, LoginFormData } from '@/lib/schemas';

const  UserLoginPage = () =>   {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { mutateAsync: login, isPending, error } = useLogin();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === UserRole.USER) router.replace('/');
    else if (user?.role === UserRole.SUPER_ADMIN) router.replace('/admin');
    else if (user?.role === UserRole.MINI_ADMIN) router.replace('/mini-admin');
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
    try {
      await login(data);
      router.push('/');
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
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">User Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to watch and explore videos</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />

            {apiError && (
              <p className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-400">
                {apiError}
              </p>
            )}

            <Button type="submit" loading={isPending} className="w-full mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            ← Back to login options
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserLoginPage;