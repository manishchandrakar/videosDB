import Joi from 'joi';
import { REGEX } from '../constants';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
});

export const registerSchema = Joi.object({
  username: Joi.string().pattern(REGEX.USERNAME).min(3).max(30).required().messages({
    'string.pattern.base': 'Username must be 3-30 characters: letters, numbers, underscores only',
    'any.required': 'Username is required',
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().pattern(REGEX.PASSWORD).required().messages({
    'string.pattern.base':
      'Password must be 8+ characters with uppercase, lowercase, number and special character',
    'any.required': 'Password is required',
  }),

  role: Joi.string().valid('SUPER_ADMIN', 'MINI_ADMIN').optional(),
});

export const signupSchema = Joi.object({
  username: Joi.string().pattern(REGEX.USERNAME).min(3).max(30).required().messages({
    'string.pattern.base': 'Username must be 3-30 characters: letters, numbers, underscores only',
    'any.required': 'Username is required',
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().pattern(REGEX.PASSWORD).required().messages({
    'string.pattern.base':
      'Password must be 8+ characters with uppercase, lowercase, number and special character',
    'any.required': 'Password is required',
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),

  newPassword: Joi.string()
    .pattern(REGEX.PASSWORD)
    .disallow(Joi.ref('currentPassword'))
    .required()
    .messages({
      'string.pattern.base':
        'New password must be 8+ characters with uppercase, lowercase, number and special character',
      'any.invalid': 'New password must be different from current password',
      'any.required': 'New password is required',
    }),
});
