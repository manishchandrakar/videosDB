import { env } from '../config/env';
import { interserverService } from './interserver.service';
import { localStorageService } from './localStorage.service';
import { IUploadResult } from '../interfaces';

export interface IStorageService {
  uploadFile(localFilePath: string, remoteDir: string, fileName: string): Promise<IUploadResult>;
  deleteFile(remoteDir: string, fileName: string): Promise<void>;
  buildFileName(originalName: string, prefix: string): string;
  cleanupTempFile(filePath: string): void;
}

export const storageService: IStorageService =
  env.STORAGE_MODE === 'ftp' ? interserverService : localStorageService;
