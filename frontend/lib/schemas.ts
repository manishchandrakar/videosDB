import { z } from 'zod';
import { PublishStatus, VIDEO_CATEGORIES } from '@/types';

// ─── Login ───────────────────────────────────────────────────────────────────

// Regex 
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^\w+$/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_NUMBER_REGEX = /\d/;
const PASSWORD_SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
const TAGS_REGEX = /^[a-zA-Z0-9\-]+(,\s*[a-zA-Z0-9\-]+)*$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      EMAIL_REGEX ,
      'Enter a valid email address'
    ),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(USERNAME_REGEX, 'Only letters, numbers and underscores allowed'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      EMAIL_REGEX,
      'Enter a valid email address'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_UPPERCASE_REGEX, 'Must contain an uppercase letter')
    .regex(PASSWORD_LOWERCASE_REGEX, 'Must contain a lowercase letter')
    .regex(PASSWORD_NUMBER_REGEX, 'Must contain a number')
    .regex(PASSWORD_SPECIAL_CHAR_REGEX  , 'Must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Upload ──────────────────────────────────────────────────────────────────

export const uploadSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .refine((v) => v.trim().length > 0, 'Title cannot be only whitespace'),

  category: z.enum(VIDEO_CATEGORIES).optional(),

  // Optional comma-separated tags: each tag is letters/numbers/hyphens
  tagsRaw: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        v.trim() === '' ||
        TAGS_REGEX.test(v.trim()),
      'Tags must be comma-separated words (letters, numbers, hyphens only)'
    ),

  status: z.nativeEnum(PublishStatus),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
