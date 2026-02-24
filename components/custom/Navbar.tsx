'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';
import Button from '@/components/common/Button';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
          VideoHub
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MINI_ADMIN) && (
                <>
                  <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/admin/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Upload
                  </Link>
                </>
              )}
              <span className="text-xs text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
