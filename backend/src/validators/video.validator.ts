import Joi from 'joi';
import { REGEX } from '../constants';

const tagSchema = Joi.string().pattern(REGEX.TAG).min(1).max(50).trim().messages({
  'string.pattern.base':
    'Each tag must contain only letters, numbers, hyphens, underscores, dots and spaces',
  'string.min': 'Tag must be at least 1 character',
  'string.max': 'Tag must not exceed 50 characters',
});

const VALID_CATEGORIES = [
  'Entertainment',
  'Education',
  'Technology',
  'Gaming',
  'Finance',
  'Lifestyle',
];

export const createVideoSchema = Joi.object({
  title: Joi.string().pattern(REGEX.VIDEO_TITLE).min(3).max(200).trim().required().messages({
    'string.pattern.base': 'Title contains invalid characters',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),

  category: Joi.string().valid(...VALID_CATEGORIES).optional().allow(null, '').messages({
    'any.only': `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
  }),

  tags: Joi.array().items(tagSchema).min(1).max(20).optional().messages({
    'array.min': 'At least one tag is required',
    'array.max': 'Maximum 20 tags allowed',
  }),

  tagsRaw: Joi.string()
    .trim()
    .optional()
    .description('Comma-separated tags string, alternative to tags array'),

  status: Joi.string().valid('DRAFT', 'PUBLISHED').default('DRAFT').optional(),
})
  .or('tags', 'tagsRaw')
  .messages({
    'object.missing': 'Either tags or tagsRaw is required',
  });

export const updateVideoSchema = Joi.object({
  title: Joi.string().pattern(REGEX.VIDEO_TITLE).min(3).max(200).trim().optional().messages({
    'string.pattern.base': 'Title contains invalid characters',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must not exceed 200 characters',
  }),

  category: Joi.string().valid(...VALID_CATEGORIES).optional().allow(null, '').messages({
    'any.only': `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
  }),

  tags: Joi.array().items(tagSchema).min(1).max(20).optional().messages({
    'array.min': 'At least one tag is required',
    'array.max': 'Maximum 20 tags allowed',
  }),

  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const videoQuerySchema = Joi.object({
  search: Joi.string().max(100).trim().optional(),
  category: Joi.string().valid(...VALID_CATEGORIES).optional().allow(''),
  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
    .optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(50).default(12).optional(),
  sortBy: Joi.string().valid('createdAt', 'views', 'title').default('createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional(),
});

export const videoIdSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    'any.required': 'Video ID is required',
  }),
});
