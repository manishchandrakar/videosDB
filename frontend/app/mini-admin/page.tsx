'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useInfiniteAdminVideos, useDeleteVideo, useToggleStatus } from '@/app/hooks/useVideos';
import VideoGrid from '@/components/custom/VideoGrid';
import InfiniteScrollSentinel from '@/components/custom/InfiniteScrollSentinel';
import Button from '@/components/common/Button';
import useDebounce from '@/utils/utils';

const MiniAdminDashboard = () => {
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: toggleStatus } = useToggleStatus();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: adminVideosData,
    isLoading: videosLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminVideos({ search: debouncedSearch || undefined });

  const videos = useMemo(
    () => adminVideosData?.pages.flatMap((p) => p.videos) ?? [],
    [adminVideosData]
  );

  const total = adminVideosData?.pages[0]?.total ?? 0;
  const published = videos.filter((v) => v.status === 'PUBLISHED').length;
  const drafts = videos.filter((v) => v.status === 'DRAFT').length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Videos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage your uploaded videos</p>
        </div>
        <Link href="/mini-admin/upload">
          <Button>+ Upload Video</Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: total },
          { label: 'Published', value: published },
          { label: 'Drafts', value: drafts },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Video list */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-semibold text-muted-foreground">All Your Videos</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your videos..."
            className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs"
          />
        </div>

        <VideoGrid
          videos={videos}
          isLoading={videosLoading}
          showStatus
          onToggleStatus={(id) => toggleStatus(id)}
          onDelete={(id) => {
            if (confirm('Delete this video? This cannot be undone.')) deleteVideo(id);
          }}
          emptyMessage="You haven't uploaded any videos yet."
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

export default MiniAdminDashboard;
