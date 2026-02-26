'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole, VIDEO_CATEGORIES } from '@/types';
import ThemeToggle from '@/components/common/ThemeToggle';
import Button from '@/components/common/Button';

const  Navbar = () =>  {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/mini-admin')) return null;

  const push = (s: string, c: string) => {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (c) params.set('category', c);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    push(search.trim(), category);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const c = e.target.value;
    setCategory(c);
    push(search.trim(), c);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
     <nav className="mx-auto flex w-full md:max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center">   {/* Logo */}
        <Link href="/" className="shrink-0 text-lg font-bold text-foreground tracking-tight">
          VideoHub
        </Link>

        {/* Search + Category */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 items-center gap-2"
        >
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="">All Categories</option>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-3">
          {isAuthenticated && (
            <>
              {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MINI_ADMIN) && (
                <Link
                  href={user.role === UserRole.SUPER_ADMIN ? '/admin' : '/mini-admin'}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
