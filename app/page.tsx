'use client';

import { useState } from 'react';
import { useVideos, useSearchVideos } from '@/app/hooks/useVideos';
import VideoGrid from '@/components/custom/VideoGrid';
import SearchBar from '@/components/custom/SearchBar';
import Pagination from '@/components/custom/Pagination';
import useDebounce from '@/utils/utils';
import { DEFAULT_LIMIT } from '@/constants';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const isSearching = debouncedSearch.length > 0;

  const { data: browsing, isLoading: browseLoading } = useVideos(
    isSearching ? undefined : { page, limit: DEFAULT_LIMIT }
  );

  const { data: searchResult, isLoading: searchLoading } = useSearchVideos(debouncedSearch);

  const data = isSearching ? searchResult : browsing;
  const isLoading = isSearching ? searchLoading : browseLoading;

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Videos</h1>
          {data && (
            <p className="mt-0.5 text-sm text-zinc-500">
              {data.total} video{data.total === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      <VideoGrid
        videos={data?.videos ?? []}
        isLoading={isLoading}
        emptyMessage={isSearching ? `No results for "${debouncedSearch}"` : 'No videos published yet.'}
      />

      {!isSearching && data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
