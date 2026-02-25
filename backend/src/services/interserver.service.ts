import * as ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import { IUploadResult } from '../interfaces';
import { ftpConfig } from '../config/interserver';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

export class InterserverService {
  private async withClient<T>(operation: (client: ftp.Client) => Promise<T>): Promise<T> {
    const client = new ftp.Client();
    client.ftp.verbose = process.env['NODE_ENV'] === 'development';

    try {
      await client.access({
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password,
        port: ftpConfig.port,
        secure: ftpConfig.secure,
      });
      return await operation(client);
    } catch (err) {
      logger.error('FTP operation failed', { error: err });
      throw new ApiError(500, 'File server operation failed');
    } finally {
      client.close();
    }
  }

  async uploadFile(
    localFilePath: string,
    remoteDir: string,
    fileName: string
  ): Promise<IUploadResult> {
    const remotePath = `${ftpConfig.uploadBasePath}/${remoteDir}/${fileName}`;
    const fileSize = fs.statSync(localFilePath).size;

    await this.withClient(async (client) => {
      await client.ensureDir(`${ftpConfig.uploadBasePath}/${remoteDir}`);
      await client.uploadFrom(localFilePath, remotePath);
    });

    const publicUrl = `${ftpConfig.publicBaseUrl}/${remoteDir}/${fileName}`;
    logger.info(`File uploaded successfully: ${publicUrl}`);

    return {
      url: publicUrl,
      fileName,
      remotePath,
      size: fileSize,
    };
  }

  async deleteFile(remoteDir: string, fileName: string): Promise<void> {
    const remotePath = `${ftpConfig.uploadBasePath}/${remoteDir}/${fileName}`;

    await this.withClient(async (client) => {
      await client.remove(remotePath);
    });

    logger.info(`File deleted: ${remotePath}`);
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

export const interserverService = new InterserverService();
