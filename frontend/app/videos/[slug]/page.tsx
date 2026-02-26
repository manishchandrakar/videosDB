'use client';

import { use, useRef } from 'react';
import { useVideoBySlug, useVideoSuggestions } from '@/app/hooks/useVideos';
import VideoGrid from '@/components/custom/VideoGrid';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import { PublishStatus } from '@/types';
import { getMediaPath } from '@/utils/mediaUtils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function VideoDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: video, isLoading, error } = useVideoBySlug(slug);
  const { data: suggestions } = useVideoSuggestions(video?.id ?? '');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    vid.volume = 1;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2 text-zinc-500">
        <p className="text-lg font-medium text-zinc-300">Video not found</p>
        <p className="text-sm">The video you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Player */}
      <div className="w-full rounded-xl overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          src={getMediaPath(video.videoUrl)}
          controls
          className="w-full h-full"
          poster={getMediaPath(video.thumbnailUrl) || undefined}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-white leading-snug">{video.title}</h1>
          <Badge variant={video.status === PublishStatus.PUBLISHED ? 'success' : 'warning'}>
            {video.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>{video.views.toLocaleString()} views</span>
          <span>·</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>

        {video.description && (
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
            {video.description}
          </p>
        )}

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.videos.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-6">
          <h2 className="text-base font-semibold text-zinc-300">Up next</h2>
          <VideoGrid videos={suggestions.videos} />
        </div>
      )}
    </div>
  );
}
