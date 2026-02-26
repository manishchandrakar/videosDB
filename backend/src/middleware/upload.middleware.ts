import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { Request } from 'express';
import { ApiError } from '../utils';
import { CONSTANTS } from '../constants';

const MB = 1024 * 1024;

// Absolute path — works regardless of which directory the server is started from
const TEMP_DIR = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const fileFilter =
  (allowedTypes: readonly string[]) =>
  (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(415, `Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
    }
  };

const tempStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadVideo = multer({
  storage: tempStorage,
  limits: { fileSize: CONSTANTS.MAX_VIDEO_SIZE_MB * MB },
  fileFilter: fileFilter(CONSTANTS.ALLOWED_VIDEO_TYPES),
}).single('video');

export const uploadThumbnail = multer({
  storage: tempStorage,
  limits: { fileSize: CONSTANTS.MAX_THUMBNAIL_SIZE_MB * MB },
  fileFilter: fileFilter(CONSTANTS.ALLOWED_IMAGE_TYPES),
}).single('thumbnail');

export const uploadVideoWithThumbnail = multer({
  storage: tempStorage,
  limits: { fileSize: CONSTANTS.MAX_VIDEO_SIZE_MB * MB },
  fileFilter: (_req, file, cb) => {
    const allAllowed: string[] = [
      ...CONSTANTS.ALLOWED_VIDEO_TYPES,
      ...CONSTANTS.ALLOWED_IMAGE_TYPES,
    ];
    if (allAllowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(415, `Invalid file type`));
    }
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);
