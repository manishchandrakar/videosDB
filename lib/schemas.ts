import { z } from 'zod';
import { PublishStatus } from '@/types';

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    ),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Upload ──────────────────────────────────────────────────────────────────

export const uploadSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .refine((v) => v.trim().length > 0, 'Title cannot be only whitespace'),

  // Optional comma-separated tags: each tag is letters/numbers/hyphens
  tagsRaw: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        v.trim() === '' ||
        /^[a-zA-Z0-9\-]+(,\s*[a-zA-Z0-9\-]+)*$/.test(v.trim()),
      'Tags must be comma-separated words (letters, numbers, hyphens only)'
    ),

  status: z.nativeEnum(PublishStatus),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
