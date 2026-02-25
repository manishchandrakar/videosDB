'use client';

import { useState } from 'react';
import { useInfiniteVideos, useSearchVideos } from '@/app/hooks/useVideos';
import VideoGrid from '@/components/custom/VideoGrid';
import SearchBar from '@/components/custom/SearchBar';
import InfiniteScrollSentinel from '@/components/custom/InfiniteScrollSentinel';
import useDebounce from '@/utils/utils';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const isSearching = debouncedSearch.length > 0;

  const {
    data: browsingData,
    isLoading: browseLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVideos();

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Videos</h1>
          {(browsingData || searchResult) && (
            <p className="mt-0.5 text-sm text-zinc-500">
              {total} video{total === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <SearchBar onSearch={setSearch} />
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage={isSearching ? `No results for "${debouncedSearch}"` : 'No videos published yet.'}
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
