interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  );
}

// ─── Composed skeletons ───────────────────────────────────────────────────────

const VideoCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-video animate-pulse bg-muted" />
      {/* Info */}
      <div className="flex flex-col gap-2.5 p-3">
        <div className="animate-pulse h-3.5 w-5/6 rounded bg-muted" />
        <div className="animate-pulse h-3 w-3/6 rounded bg-muted" />
        <div className="mt-1 flex gap-1.5">
          <div className="animate-pulse h-4 w-12 rounded-full bg-muted" />
          <div className="animate-pulse h-4 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-muted p-5">
      <div className="animate-pulse h-3 w-24 rounded bg-muted-foreground/20" />
      <div className="mt-3 animate-pulse h-8 w-16 rounded bg-muted-foreground/20" />
    </div>
  );
}

export function VideoGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="animate-pulse h-7 w-36 rounded bg-muted" />
          <div className="animate-pulse h-3.5 w-48 rounded bg-muted" />
        </div>
        <div className="animate-pulse h-9 w-32 rounded-lg bg-muted" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Video grid */}
      <VideoGridSkeleton count={8} />
    </div>
  );
}

export const MiniAdminPageSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="animate-pulse h-7 w-36 rounded bg-muted" />
          <div className="animate-pulse h-3.5 w-48 rounded bg-muted" />
        </div>
        <div className="animate-pulse h-9 w-32 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <VideoGridSkeleton count={6} />
    </div>
  );
}
