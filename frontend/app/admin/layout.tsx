'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';
import Button from '@/components/common/Button';
import ThemeToggle from '@/components/common/ThemeToggle';
import { AdminPageSkeleton } from '@/components/common/Skeleton';
import Badge from '@/components/common/Badge';

import {
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineUsers,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    superAdminOnly: false,
    icon: <HiOutlineHome className="h-4 w-4" />,
  },
  {
    href: '/admin/upload',
    label: 'Upload Video',
    exact: false,
    superAdminOnly: false,
    icon: <HiOutlineCloudArrowUp className="h-4 w-4" />,
  },
  {
    href: '/admin/users',
    label: 'Users',
    exact: false,
    superAdminOnly: true,
    icon: <HiOutlineUsers className="h-4 w-4" />,
  },
];
const  AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login/admin');
    } else if (user.role === UserRole.MINI_ADMIN) {
      router.replace('/mini-admin');
    } else if (user.role === UserRole.USER) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <aside className="w-56 shrink-0 border-r border-border bg-card" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="h-12 border-b border-border bg-card" />
          <main className="flex-1 p-6">
            <AdminPageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    return null;
  }

  const isSuperAdmin = true;

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
          {NAV_ITEMS.map(({ href, label, exact, icon }) => {
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

export default AdminLayout;
