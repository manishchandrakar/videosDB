'use client';

import { useSearchParams } from 'next/navigation';
import { useInfiniteVideos, useSearchVideos } from '@/app/hooks/useVideos';
import VideoGrid from '@/components/custom/VideoGrid';
import InfiniteScrollSentinel from '@/components/custom/InfiniteScrollSentinel';
import useDebounce from '@/utils/utils';

const  HomeContent = () =>   {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';

  const debouncedSearch = useDebounce(search, 400);
  const isSearching = debouncedSearch.length > 0;

  const {
    data: browsingData,
    isLoading: browseLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVideos({ category: category || undefined });

  const { data: searchResult, isLoading: searchLoading } = useSearchVideos(debouncedSearch);

  const videos = isSearching
    ? (searchResult?.videos ?? [])
    : (browsingData?.pages.flatMap((p) => p.videos) ?? []);

  const total = isSearching
    ? (searchResult?.total ?? 0)
    : (browsingData?.pages[0]?.total ?? 0);

  const isLoading = isSearching ? searchLoading : browseLoading;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {category ? category : 'All Videos'}
        </h1>
        {(browsingData || searchResult) && (
          <p className="mt-0.5 text-sm text-zinc-500">
            {total} video{total === 1 ? '' : 's'}
            {isSearching && ` for "${search}"`}
            {category && !isSearching && ` in ${category}`}
          </p>
        )}
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage={
          isSearching
            ? `No results for "${debouncedSearch}"`
            : category
            ? `No videos in ${category} yet.`
            : 'No videos published yet.'
        }
      />

      {!isSearching && (
        <InfiniteScrollSentinel
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
}

import { Suspense } from 'react';
import { VideoGridSkeleton } from '@/components/common/Skeleton';

const  HomePage = () =>  {
  return (
    <Suspense fallback={<VideoGridSkeleton count={12} />}>
      <HomeContent />
    </Suspense>
  );
}
export default HomePage;
