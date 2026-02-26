import fs from 'node:fs';
import path from 'node:path';
import { IUploadResult } from '../interfaces';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// Absolute path — resolves to backend/uploads regardless of cwd
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

export class LocalStorageService {
  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    const dirs = [
      path.join(UPLOAD_DIR, 'videos'),
      path.join(UPLOAD_DIR, 'thumbnails'),
      path.join(UPLOAD_DIR, 'temp'),
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async uploadFile(
    localFilePath: string,
    remoteDir: string,
    fileName: string
  ): Promise<IUploadResult> {
    const destDir = path.join(UPLOAD_DIR, remoteDir);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const destPath = path.join(destDir, fileName);
    const fileSize = fs.statSync(localFilePath).size;

    fs.copyFileSync(localFilePath, destPath);

    const publicUrl = `${env.PUBLIC_BASE_URL}/uploads/${remoteDir}/${fileName}`;
    logger.info(`File stored locally: ${publicUrl}`);

    return {
      url: publicUrl,
      fileName,
      remotePath: destPath,
      size: fileSize,
    };
  }

  async deleteFile(remoteDir: string, fileName: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, remoteDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filePath}`);
    }
  }

  buildFileName(originalName: string, prefix: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    return `${prefix}-${timestamp}${ext}`;
  }

  cleanupTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      logger.warn('Failed to cleanup temp file', { filePath, error: err });
    }
  }
}

export const localStorageService = new LocalStorageService();
