"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/types";
import Button from "@/components/common/Button";
import ThemeToggle from "@/components/common/ThemeToggle";
import { AdminPageSkeleton } from "@/components/common/Skeleton";
import Badge from "@/components/common/Badge";

import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { ADMIN_NAV_ITEMS } from "@/types/constant";

interface ISidebarProps {
  readonly email: string;
  readonly role: string;
  readonly pathname: string;
  readonly onLinkClick?: () => void;
}

const SidebarContent = (props: ISidebarProps) => {
  const { email, role, pathname, onLinkClick } = props;
  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <HiOutlineVideoCamera className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-foreground">VideoHub</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Menu
        </p>
        {ADMIN_NAV_ITEMS.map(({ href, label, exact, icon: Icon }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={[
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground uppercase">
            {email[0] ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              {email}
            </p>
            <Badge variant="info" className="mt-0.5 text-black text-[10px]">
              {role}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login/admin");
    } else if (user.role === UserRole.MINI_ADMIN) {
      router.replace("/mini-admin");
    } else if (user.role === UserRole.USER) {
      router.replace("/");
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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Button
          variant="ghost"
          size="sm"
          className="m-3"
          onClick={closeSidebar}
        >
          Close Sidebar
          <HiOutlineXMark className="h-5 w-5" />
        </Button>

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
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineBars3 className="h-5 w-5" />
              Open Sidebar
            </Button>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
