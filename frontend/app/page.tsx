'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useInfiniteVideos, useSearchVideos } from '@/app/hooks/useVideos';
import { useActiveAds } from '@/app/hooks/useAds';
import VideoGrid from '@/components/custom/VideoGrid';
import AdCard from '@/components/custom/AdCard';
import InfiniteScrollSentinel from '@/components/custom/InfiniteScrollSentinel';
import useDebounce from '@/utils/utils';
import { VideoQuery } from '@/types';

type SortOption = 'latest' | 'views';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'views', label: 'Most Viewed' },
];

const AD_INTERVAL = 6;

function sortToQuery(sort: SortOption): Pick<VideoQuery, 'sortBy' | 'sortOrder'> {
  if (sort === 'views') return { sortBy: 'views', sortOrder: 'desc' };
  return { sortBy: 'createdAt', sortOrder: 'desc' };
}

const HomeContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = (searchParams.get('sort') as SortOption) ?? 'latest';

  const debouncedSearch = useDebounce(search, 400);
  const isSearching = debouncedSearch.length > 0;

  const {
    data: browsingData,
    isLoading: browseLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVideos({ category: category || undefined, ...sortToQuery(sort) });

  const { data: searchResult, isLoading: searchLoading } = useSearchVideos(debouncedSearch);
  const { data: ads = [] } = useActiveAds('home');

  const videos = isSearching
    ? (searchResult?.videos ?? [])
    : (browsingData?.pages.flatMap((p) => p.videos) ?? []);

  const total = isSearching
    ? (searchResult?.total ?? 0)
    : (browsingData?.pages[0]?.total ?? 0);

  const isLoading = isSearching ? searchLoading : browseLoading;

  const handleSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'latest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build mixed grid items: video cards + ad cards every AD_INTERVAL slots
  const gridItems = videos.flatMap((video, i) => {
    const items: React.ReactNode[] = [
      <VideoCardWrapper key={`v-${video.id}`} video={video} />,
    ];
    if ((i + 1) % AD_INTERVAL === 0) {
      const ad = ads[Math.floor((i + 1) / AD_INTERVAL) - 1];
      if (ad) items.push(<AdCard key={`ad-${ad.id}-${i}`} ad={ad} />);
    }
    return items;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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

        {!isSearching && (
          <div className="flex items-center gap-2">
            {SORT_OPTIONS.map(({ value, label }) => {
              const active = sort === value;
              return (
                <button
                  key={value}
                  onClick={() => handleSort(value)}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Mixed grid: videos + ads ── */}
      {isSearching ? (
        <VideoGrid
          videos={videos}
          isLoading={isLoading}
          emptyMessage={`No results for "${debouncedSearch}"`}
        />
      ) : isLoading ? (
        <VideoGridSkeleton count={12} />
      ) : videos.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          {category ? `No videos in ${category} yet.` : 'No videos published yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gridItems}
        </div>
      )}

      {!isSearching && (
        <InfiniteScrollSentinel
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
};

import { Suspense } from 'react';
import { VideoGridSkeleton } from '@/components/common/Skeleton';
import VideoCard from '@/components/custom/VideoCard';
import { Video } from '@/types';

// Thin wrapper so VideoCard fits in the mixed grid
function VideoCardWrapper({ video }: { readonly video: Video }) {
  return <VideoCard video={video} />;
}

const HomePage = () => {
  return (
    <Suspense fallback={<VideoGridSkeleton count={12} />}>
      <HomeContent />
    </Suspense>
  );
};
export default HomePage;
