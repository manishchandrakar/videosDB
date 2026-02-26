'use client';

import { useEffect, useState } from 'react';
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
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: <HiOutlineHome className="h-4 w-4" />,
  },
  {
    href: '/admin/upload',
    label: 'Upload Video',
    exact: false,
    icon: <HiOutlineCloudArrowUp className="h-4 w-4" />,
  },
  {
    href: '/admin/users',
    label: 'Users',
    exact: false,
    icon: <HiOutlineUsers className="h-4 w-4" />,
  },
];

interface SidebarProps {
  readonly email: string;
  readonly role: string;
  readonly pathname: string;
  readonly onLinkClick?: () => void;
}

function SidebarContent({ email, role, pathname, onLinkClick }: SidebarProps) {
  return (
    <>
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
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
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

      {/* User info at bottom */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground uppercase">
            {email[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{email}</p>
            <Badge variant="info" className="mt-0.5 text-black text-[10px]">
              {role}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <aside className="hidden lg:flex w-56 shrink-0 border-r border-border bg-card" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="h-12 border-b border-border bg-card" />
          <main className="flex-1 p-4 sm:p-6">
            <AdminPageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    return null;
  }

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Mobile overlay backdrop ──────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Mobile drawer sidebar ────────────────── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <button
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={closeSidebar}
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
        <SidebarContent
          email={user.email}
          role={user.role}
          pathname={pathname}
          onLinkClick={closeSidebar}
        />
      </aside>

      {/* ── Desktop sidebar ──────────────────────── */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card">
        <SidebarContent
          email={user.email}
          role={user.role}
          pathname={pathname}
        />
      </aside>

      {/* ── Main area ───────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineBars3 className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold text-muted-foreground">
              Admin Panel
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
