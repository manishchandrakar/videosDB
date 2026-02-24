'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/app/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { UserRole } from '@/types';
import { loginSchema, LoginFormData } from '@/lib/schemas';

const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.MINI_ADMIN];

export default function AdminLoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending, error } = useLogin();
  const [accessError, setAccessError] = useState('');

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
      if (!ADMIN_ROLES.includes(result.user.role as UserRole)) {
        setAccessError('This account does not have admin privileges.');
        return;
      }
      router.push('/admin');
    } catch {
      // error shown via apiError below
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
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
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
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />

            {(apiError || accessError) && (
              <p className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-400">
                {accessError || apiError}
              </p>
            )}

            <Button type="submit" loading={isPending} variant="secondary" className="w-full mt-1">
              Sign in as Admin
            </Button>
          </form>
        </div>

        {/* User link */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Not an admin?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in as a user
          </Link>
        </p>
      </div>
    </div>
  );
}
