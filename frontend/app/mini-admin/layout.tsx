'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';
import Button from '@/components/common/Button';
import { MiniAdminPageSkeleton } from '@/components/common/Skeleton';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { HiOutlineCloudArrowUp } from 'react-icons/hi2';

const NAV_ITEMS = [
  {
    href: '/mini-admin',
    label: 'My Videos',
    icon: <HiOutlineVideoCamera className="h-5 w-5" />,
  },
  {
    href: '/mini-admin/upload',
    label: 'Upload Video',
    icon: <HiOutlineCloudArrowUp className="h-5 w-5" />,
  },
];
const  MiniAdminLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login/admin');
      } else if (user?.role === UserRole.SUPER_ADMIN) {
        router.replace('/admin');
      } else if (user?.role === UserRole.USER) {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== UserRole.MINI_ADMIN) {
    return (
      <div className="flex min-h-screen bg-background">
        <aside className="w-60 shrink-0 border-r border-border bg-card" />
        <main className="flex-1 p-8">
          <MiniAdminPageSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <span className="font-semibold text-foreground">Mini Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center gap-2 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase text-muted-foreground">
              {user.username[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={logout}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

export default MiniAdminLayout;