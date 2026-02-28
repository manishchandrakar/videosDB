'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Advertisement } from '@/types';
import { getMediaPath } from '@/utils/mediaUtils';

interface AdCardProps {
  readonly ad: Advertisement;
  /** compact = sidebar style (horizontal), default = grid style (vertical) */
  readonly compact?: boolean;
}

const AdCard = ({ ad, compact = false }: AdCardProps) => {
  const [imgError, setImgError] = useState(false);
  const thumbSrc = ad.thumbnailUrl ? getMediaPath(ad.thumbnailUrl) : null;

  if (compact) {
    // ── Sidebar / horizontal card (like SuggestionCard)
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 group rounded-lg p-1 hover:bg-white/5 transition-colors"
      >
        <div className="relative aspect-video w-40 shrink-0 rounded-md overflow-hidden bg-zinc-800">
          {thumbSrc && !imgError ? (
            <Image
              src={thumbSrc}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="160px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-800">
              <svg className="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
          )}
          {/* Ad badge */}
          <span className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Ad
          </span>
        </div>
        <div className="flex flex-col gap-1 min-w-0 py-1">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-200 leading-snug group-hover:text-white transition-colors">
            {ad.title}
          </h3>
          <p className="text-xs text-orange-400 font-medium">Sponsored</p>
        </div>
      </a>
    );
  }

  // ── Grid card (vertical, same size as VideoCard)
  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl bg-card border border-orange-900/30 overflow-hidden hover:border-orange-600/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {thumbSrc && !imgError ? (
          <Image
            src={thumbSrc}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <svg className="h-12 w-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        )}
        {/* Ad badge */}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          Ad
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-orange-400 transition-colors leading-snug">
          {ad.title}
        </h3>
        <p className="text-xs text-orange-400 font-medium">Sponsored</p>
      </div>
    </a>
  );
};

export default AdCard;
