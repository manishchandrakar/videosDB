'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useDashboard, useInfiniteAdminVideos, useDeleteVideo, useToggleStatus } from '@/app/hooks/useVideos';
import { useUsers } from '@/app/hooks/useAuth';
import { useAuth } from '@/app/context/AuthContext';
import VideoGrid from '@/components/custom/VideoGrid';
import InfiniteScrollSentinel from '@/components/custom/InfiniteScrollSentinel';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { UserRole } from '@/types';
import useDebounce from '@/utils/utils';

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-muted p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: toggleStatus } = useToggleStatus();

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: adminVideosData,
    isLoading: videosLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminVideos({
    search: debouncedSearch || undefined,
  });

  const videos = useMemo(
    () => adminVideosData?.pages.flatMap((p) => p.videos) ?? [],
    [adminVideosData]
  );

  // Only super admin can call /auth/users (MINI_ADMIN would get 403)
  const { data: users = [] } = useUsers(isSuperAdmin);

  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.username])),
    [users]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Logged in as{' '}
            <Badge variant={isSuperAdmin ? 'info' : 'default'}>
              {user?.role}
            </Badge>
          </p>
        </div>
        <Link href="/admin/upload">
          <Button>+ Upload Video</Button>
        </Link>
      </div>

      {/* Stats – super admin only */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statsLoading ? (
            <div className="col-span-4 flex justify-center py-8"><Spinner /></div>
          ) : stats ? (
            <>
              <StatCard label="Total Videos" value={stats.totalVideos} />
              <StatCard label="Published" value={stats.publishedVideos} />
              <StatCard label="Drafts" value={stats.draftVideos} />
              <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} />
            </>
          ) : null}
        </div>
      )}

      {/* Video list */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-semibold text-muted-foreground">
            {isSuperAdmin ? 'All Videos' : 'Your Videos'}
          </h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs"
          />
        </div>
        <VideoGrid
          videos={videos}
          isLoading={videosLoading}
          showStatus
          userMap={isSuperAdmin ? userMap : undefined}
          onToggleStatus={isSuperAdmin ? (id) => toggleStatus(id) : undefined}
          onDelete={isSuperAdmin ? (id) => {
            if (confirm('Delete this video?')) deleteVideo(id);
          } : undefined}
          emptyMessage="No videos uploaded yet."
        />
        <InfiniteScrollSentinel
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
