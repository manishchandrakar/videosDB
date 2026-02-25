export interface IFtpConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  secure: boolean;
  uploadBasePath: string;
  publicBaseUrl: string;
}

export interface IUploadResult {
  url: string;
  fileName: string;
  remotePath: string;
  size: number;
}

export interface IUploadProgress {
  percent: number;
  bytesTransferred: number;
  totalBytes: number;
}
