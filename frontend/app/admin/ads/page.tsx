'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useAllAds, useCreateAd, useToggleAdStatus, useDeleteAd } from '@/app/hooks/useAds';
import { AdStatus, Advertisement } from '@/types';
import { getMediaPath } from '@/utils/mediaUtils';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

/* ── Create Ad Form ── */
function CreateAdForm({ onClose }: { readonly onClose: () => void }) {
  const { mutate: createAd, isPending } = useCreateAd();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Convert checkboxes explicitly
    fd.set('showOnHome', (e.currentTarget.querySelector<HTMLInputElement>('[name=showOnHome]')?.checked) ? 'true' : 'false');
    fd.set('showOnSidebar', (e.currentTarget.querySelector<HTMLInputElement>('[name=showOnSidebar]')?.checked) ? 'true' : 'false');
    createAd(fd, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Ad</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Ad Title *</label>
            <input
              name="title"
              required
              placeholder="Enter ad title"
              className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Target URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Target URL *</label>
            <input
              name="targetUrl"
              type="url"
              required
              placeholder="https://example.com"
              className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Thumbnail (optional)</label>
            {preview && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-800 mb-1">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-dashed border-zinc-600 px-3 py-2 text-sm text-zinc-400 hover:border-orange-500 hover:text-orange-400 transition-colors text-center"
            >
              {preview ? 'Change image' : 'Upload thumbnail'}
            </button>
            <input
              ref={fileRef}
              name="thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          {/* Placement checkboxes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400">Show on</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="showOnHome"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span className="text-sm text-zinc-300">Home page grid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="showOnSidebar"
                type="checkbox"
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span className="text-sm text-zinc-300">Video page sidebar</span>
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-orange-500 text-white text-sm font-semibold py-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Ad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Ad Row Card ── */
function AdRow({ ad }: { readonly ad: Advertisement }) {
  const { mutate: toggle, isPending: toggling } = useToggleAdStatus();
  const { mutate: remove, isPending: removing } = useDeleteAd();
  const [imgError, setImgError] = useState(false);
  const toggleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = () => {
    if (toggleTimer.current) clearTimeout(toggleTimer.current);
    toggleTimer.current = setTimeout(() => toggle(ad.id), 500);
  };
  const thumbSrc = ad.thumbnailUrl ? getMediaPath(ad.thumbnailUrl) : null;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-zinc-900 border border-zinc-800 p-3 hover:border-zinc-700 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-28 aspect-video rounded-md overflow-hidden bg-zinc-800 shrink-0">
        {thumbSrc && !imgError ? (
          <Image src={thumbSrc} alt={ad.title} fill className="object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{ad.title}</p>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-orange-400 truncate block"
        >
          {ad.targetUrl}
        </a>
        <div className="flex flex-wrap gap-1 mt-1">
          {ad.showOnHome && <Badge variant="info">Home</Badge>}
          {ad.showOnSidebar && <Badge variant="info">Sidebar</Badge>}
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={ad.status === AdStatus.ACTIVE ? 'success' : 'warning'}>
          {ad.status}
        </Badge>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
        >
          {toggling ? '...' : ad.status === AdStatus.ACTIVE ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => remove(ad.id)}
          disabled={removing}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {removing ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AdminAdsPage() {
  const { data: ads = [], isLoading } = useAllAds();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ads</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{ads.length} ad{ads.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Ad
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Ads', value: ads.length },
          { label: 'Active', value: ads.filter((a) => a.status === AdStatus.ACTIVE).length },
          { label: 'Inactive', value: ads.filter((a) => a.status === AdStatus.INACTIVE).length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Ad list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-zinc-500">
          <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="text-sm">No ads yet. Create your first ad!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ads.map((ad) => (
            <AdRow key={ad.id} ad={ad} />
          ))}
        </div>
      )}

      {/* Create Ad Modal */}
      {showForm && <CreateAdForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
