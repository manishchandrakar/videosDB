import { Video } from '@/types';
import VideoCard from './VideoCard';
import Spinner from '@/components/common/Spinner';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  showStatus?: boolean;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  emptyMessage?: string;
  userMap?: Record<string, string>;
}

export default function VideoGrid({
  videos,
  isLoading = false,
  showStatus = false,
  onDelete,
  onToggleStatus,
  emptyMessage = 'No videos found.',
  userMap,
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-500">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showStatus={showStatus}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          uploaderName={userMap ? (userMap[video.uploadedBy] ?? 'Unknown') : undefined}
        />
      ))}
    </div>
  );
}
