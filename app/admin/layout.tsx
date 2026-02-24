'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';
import Button from '@/components/common/Button';
import ThemeToggle from '@/components/common/ThemeToggle';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';

const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.MINI_ADMIN];

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    superAdminOnly: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/upload',
    label: 'Upload Video',
    exact: false,
    superAdminOnly: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Users',
    exact: false,
    superAdminOnly: true,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !ADMIN_ROLES.includes(user.role as UserRole)) {
      router.replace('/login/admin');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !ADMIN_ROLES.includes(user.role as UserRole)) {
    return null;
  }

  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-foreground">VideoHub</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Menu
          </p>
          {NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin).map(({ href, label, exact, icon }) => {
            const active = exact ? pathname === href : pathname?.startsWith(href) ?? false;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Role badge at bottom */}
        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground uppercase">
              {user.email?.[0] ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{user.email}</p>
              <Badge variant={isSuperAdmin ? 'info' : 'default'} className="mt-0.5 text-[10px]">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Admin Panel
          </h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
