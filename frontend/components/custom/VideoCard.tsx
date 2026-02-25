import Link from 'next/link';
import Image from 'next/image';
import { Video, PublishStatus } from '@/types';
import Badge from '@/components/common/Badge';
import { getMediaPath } from '@/utils/mediaUtils';

interface VideoCardProps {
  video: Video;
  showStatus?: boolean;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  uploaderName?: string;
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function VideoCard({
  video,
  showStatus = false,
  onDelete,
  onToggleStatus,
  uploaderName,
}: VideoCardProps) {
  return (
    <div className="group flex flex-col rounded-xl bg-card border border-border overflow-hidden hover:border-muted-foreground transition-colors">
      {/* Thumbnail */}
      <Link href={`/videos/${video.slug}`} className="relative block aspect-video bg-muted">
        {video.thumbnailUrl ? (
          <Image
            src={getMediaPath(video.thumbnailUrl)}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
        {showStatus && (
          <div className="absolute top-2 left-2">
            <Badge variant={video.status === PublishStatus.PUBLISHED ? 'success' : 'warning'}>
              {video.status}
            </Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/videos/${video.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-foreground hover:text-blue-400 transition-colors leading-snug">
            {video.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatViews(video.views)} views</span>
          <span>·</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>

        {uploaderName && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{uploaderName}</span>
          </div>
        )}

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge>+{video.tags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Admin actions */}
        {(onDelete || onToggleStatus) && (
          <div className="flex gap-2 pt-2 border-t border-border mt-1">
            {onToggleStatus && (
              <button
                onClick={() => onToggleStatus(video.id)}
                className="flex-1 rounded py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {video.status === PublishStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(video.id)}
                className="rounded py-1 px-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
