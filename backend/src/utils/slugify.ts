import { v4 as uuidv4 } from 'uuid';

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateUniqueSlug = (title: string): string => {
  const base = slugify(title);
  const suffix = uuidv4().split('-')[0];
  return `${base}-${suffix}`;
};
