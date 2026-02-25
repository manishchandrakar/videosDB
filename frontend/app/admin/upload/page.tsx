'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadVideo } from '@/app/hooks/useVideos';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { PublishStatus } from '@/types';
import { uploadSchema, UploadFormData } from '@/lib/schemas';

export default function UploadVideoPage() {
  const router = useRouter();

  const { mutateAsync: upload, isPending, error } = useUploadVideo();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const videoRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      tagsRaw: '',
      status: PublishStatus.DRAFT,
    },
    mode: 'onTouched',
    delayError: 300,
  });

  const status = watch('status');

  const onSubmit = async (data: UploadFormData) => {
    if (!videoFile) {
      setFileError('Please select a video file');
      return;
    }
    setFileError('');

    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('tagsRaw', data.tagsRaw ?? '');
    fd.append('status', data.status);
    fd.append('video', videoFile);
    if (thumbFile) fd.append('thumbnail', thumbFile);

    try {
      await upload(fd);
      router.push('/admin');
    } catch {
      // error shown below
    }
  };

  const apiError = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Upload failed'
    : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
        <p className="mt-1 text-sm text-zinc-500">Fill in the details and select your video file.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Title"
          placeholder="Enter video title"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Tags (comma-separated)"
          placeholder="react, nextjs, tutorial"
          error={errors.tagsRaw?.message}
          {...register('tagsRaw')}
        />

        {/* Status toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-300">Status</label>
          <div className="flex gap-2">
            {[PublishStatus.DRAFT, PublishStatus.PUBLISHED].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue('status', s, { shouldValidate: true })}
                className={[
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  status === s
                    ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600',
                ].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Video file */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-300">Video File *</label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-8 text-zinc-500 hover:border-zinc-600 transition-colors"
            onClick={() => videoRef.current?.click()}
          >
            {videoFile ? (
              <div className="flex items-center gap-2">
                <Badge variant="success">Selected</Badge>
                <span className="text-sm text-zinc-300 truncate max-w-xs">{videoFile.name}</span>
              </div>
            ) : (
              <>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm">Click to select video</p>
              </>
            )}
          </div>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              setVideoFile(e.target.files?.[0] ?? null);
              setFileError('');
            }}
          />
          {fileError && (
            <p className="text-sm text-red-400">{fileError}</p>
          )}
        </div>

        {/* Thumbnail file */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-300">Thumbnail (optional)</label>
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-400 hover:border-zinc-600 transition-colors"
            onClick={() => thumbRef.current?.click()}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{thumbFile ? thumbFile.name : 'Select thumbnail image'}</span>
          </div>
          <input
            ref={thumbRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {apiError && (
          <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
            {apiError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending} className="flex-1">
            {isPending ? 'Uploading…' : 'Upload Video'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
