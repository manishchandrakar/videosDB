'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';

const LOGIN_OPTIONS = [
  {
    href: '/login/user',
    label: 'User Login',
    description: 'Watch and explore published videos',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20 hover:border-blue-400/50',
  },
  {
    href: '/login/admin',
    label: 'Mini Admin Login',
    description: 'Upload and manage your own videos',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
  },
  {
    href: '/login/admin',
    label: 'Main Admin Login',
    description: 'Full platform control and analytics',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-400/50',
  },
];

export default function LoginLandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === UserRole.SUPER_ADMIN) router.replace('/admin');
    else if (user?.role === UserRole.MINI_ADMIN) router.replace('/mini-admin');
    else if (user?.role === UserRole.USER) router.replace('/');
  }, [isLoading, user, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose how you want to sign in</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {LOGIN_OPTIONS.map((opt) => (
            <Link key={opt.label} href={opt.href}>
              <div className={[
                'flex items-center gap-5 rounded-2xl border p-5 transition-all cursor-pointer',
                opt.border,
              ].join(' ')}>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${opt.bg} ${opt.color}`}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{opt.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{opt.description}</p>
                </div>
                <svg className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
