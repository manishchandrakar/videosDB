'use client';

import { use, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVideoBySlug, useVideoSuggestions } from '@/app/hooks/useVideos';
import { useActiveAds } from '@/app/hooks/useAds';
import Badge from '@/components/common/Badge';
import AdCard from '@/components/custom/AdCard';
import Spinner from '@/components/common/Spinner';
import { PublishStatus, Video } from '@/types';
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

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

function SuggestionCard({ video }: { readonly video: Video }) {
  const [imgError, setImgError] = useState(false);
  const thumbSrc = video.thumbnailUrl ? getMediaPath(video.thumbnailUrl) : null;

  return (
    <Link
      href={`/videos/${video.slug}`}
      className="flex gap-2 group rounded-lg p-1 hover:bg-white/5 transition-colors"
    >
      <div className="relative aspect-video w-40 shrink-0 rounded-md overflow-hidden bg-zinc-800">
        {thumbSrc && !imgError ? (
          <Image
            src={thumbSrc}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="160px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0 py-1">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-200 leading-snug group-hover:text-white transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-zinc-500">{formatViews(video.views)} views</p>
        <p className="text-xs text-zinc-600">{formatDate(video.createdAt)}</p>
      </div>
    </Link>
  );
}

function DescriptionBox({ description, tags }: { readonly description?: string; readonly tags: string[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!description && tags.length === 0) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      className="rounded-xl bg-white/5 p-3 cursor-pointer select-none"
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
    >
      {!expanded ? (
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          {description && <span className="line-clamp-1 flex-1">{description}</span>}
          <span className="text-xs text-zinc-400 font-semibold shrink-0">...more</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {description && (
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{description}</p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
          <span className="text-xs text-zinc-400 font-semibold">Show less</span>
        </div>
      )}
    </div>
  );
}

export default function VideoDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: video, isLoading, error } = useVideoBySlug(slug);
  const { data: suggestions } = useVideoSuggestions(video?.id ?? '');
  const { data: sidebarAds = [] } = useActiveAds('sidebar');
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
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="text-lg font-medium text-zinc-300">Video not found</p>
        <p className="text-sm text-zinc-500">The video you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const hasSuggestions = suggestions && suggestions.videos.length > 0;
  const hasSidebarAds = sidebarAds.length > 0;
  const showSidebar = hasSuggestions || hasSidebarAds;

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row xl:gap-6 xl:px-6 xl:pt-6 xl:max-w-[1800px] xl:mx-auto">

        {/* LEFT: Player + Info */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Video player — edge-to-edge on mobile */}
          <div className="w-full bg-black aspect-video">
            <video
              ref={videoRef}
              src={getMediaPath(video.videoUrl)}
              controls
              controlsList="nodownload"
              className="w-full h-full"
              poster={getMediaPath(video.thumbnailUrl) ?? undefined}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
            >
              <track kind="captions" />
            </video>
          </div>

          {/* Info section */}
          <div className="px-4 xl:px-0 pt-3 pb-6 flex flex-col gap-2">
            <h1 className="text-lg font-bold text-white leading-snug">{video.title}</h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span>{video.views.toLocaleString()} views</span>
              <span>·</span>
              <span>{formatDate(video.createdAt)}</span>
              <Badge
                variant={video.status === PublishStatus.PUBLISHED ? 'success' : 'warning'}
                className="ml-auto"
              >
                {video.status}
              </Badge>
            </div>

            <DescriptionBox description={video.description ?? undefined} tags={video.tags} />

            {/* Mobile: suggestions + ads below info */}
            {showSidebar && (
              <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-2 xl:hidden">
                {hasSuggestions && (
                  <>
                    <h2 className="text-sm font-semibold text-zinc-300">Up next</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {suggestions.videos.map((v) => (
                        <SuggestionCard key={v.id} video={v} />
                      ))}
                    </div>
                  </>
                )}
                {hasSidebarAds && (
                  <div className="mt-2">
                    <h2 className="text-sm font-semibold text-orange-400/80 mb-1">Sponsored</h2>
                    {sidebarAds.map((ad) => (
                      <AdCard key={ad.id} ad={ad} compact />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR — desktop only (the blue area from screenshot) */}
        {showSidebar && (
          <div className="hidden xl:flex flex-col gap-1 w-[400px] shrink-0">

            {/* Up next suggestions */}
            {hasSuggestions && (
              <>
                <h2 className="text-sm font-semibold text-zinc-300 mb-2 px-1">Up next</h2>
                {suggestions.videos.map((v) => (
                  <SuggestionCard key={v.id} video={v} />
                ))}
              </>
            )}

            {/* Sponsored ads */}
            {hasSidebarAds && (
              <div className="mt-4 flex flex-col gap-1">
                <p className="text-xs font-semibold text-orange-400/70 px-1 mb-1 uppercase tracking-wide">
                  Sponsored
                </p>
                {sidebarAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} compact />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
