'use client';

import { useEffect, useRef } from 'react';
import Spinner from '@/components/common/Spinner';

interface InfiniteScrollSentinelProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScrollSentinel({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={ref} className="flex justify-center py-6">
      {isLoading && <Spinner />}
    </div>
  );
}
