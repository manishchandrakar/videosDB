"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useDashboard,
  useInfiniteAdminVideos,
  useDeleteVideo,
  useToggleStatus,
} from "@/app/hooks/useVideos";
import { useUsers } from "@/app/hooks/useAuth";
import VideoGrid from "@/components/custom/VideoGrid";
import InfiniteScrollSentinel from "@/components/custom/InfiniteScrollSentinel";
import { StatCardSkeleton } from "@/components/common/Skeleton";
import Button from "@/components/common/Button";
import { PublishStatus } from "@/types";
import useDebounce from "@/utils/utils";

const StatCard = (
  props: Readonly<{ label: string; value: number | string }>,
) => {
  const { label, value } = props;
  return (
    <div className="rounded-xl border border-border bg-muted p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};

type StatusFilter = "all" | PublishStatus;

const AdminDashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: toggleStatus } = useToggleStatus();
  const { data: users = [] } = useUsers(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: adminVideosData,
    isLoading: videosLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminVideos({
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const videos = useMemo(
    () => adminVideosData?.pages.flatMap((p) => p.videos) ?? [],
    [adminVideosData],
  );

  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.username])),
    [users],
  );

  const pendingApproval = videos.filter(
    (v) => v.status === PublishStatus.DRAFT,
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Full platform control
          </p>
        </div>
        <Link href="/admin/upload">
          <Button>+ Upload Video</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statsLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        )}
        {!statsLoading && stats && (
          <>
            <StatCard label="Total Videos" value={stats.totalVideos} />
            <StatCard label="Published" value={stats.publishedVideos} />
            <StatCard label="Drafts" value={stats.draftVideos} />
            <StatCard
              label="Total Views"
              value={stats.totalViews.toLocaleString()}
            />
            <StatCard label="Total Users" value={users.length} />
          </>
        )}
      </div>

      {/* Pending approval banner */}
      {pendingApproval > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm font-medium text-amber-300">
              {pendingApproval} video{pendingApproval === 1 ? "" : "s"} pending
              approval
            </p>
          </div>
          <button
            onClick={() => setStatusFilter(PublishStatus.DRAFT)}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 underline"
          >
            Review now
          </button>
        </div>
      )}

      {/* Video list */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-muted-foreground">
            All Videos
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status filter tabs */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              {(
                [
                  ["all", "All"],
                  [PublishStatus.PUBLISHED, "Published"],
                  [PublishStatus.DRAFT, "Pending"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={[
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    statusFilter === val
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs"
            />
          </div>
        </div>

        <VideoGrid
          videos={videos}
          isLoading={videosLoading}
          showStatus
          userMap={userMap}
          onToggleStatus={(id) => toggleStatus(id)}
          onDelete={(id) => {
            if (confirm("Delete this video?")) deleteVideo(id);
          }}
          emptyMessage={
            statusFilter === PublishStatus.DRAFT
              ? "No videos pending approval."
              : "No videos uploaded yet."
          }
        />

        <InfiniteScrollSentinel
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        />
      </div>
    </div>
  );
};
export default AdminDashboardPage;
