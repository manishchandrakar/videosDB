import { IFtpConfig } from '../interfaces';
import { env } from './env';

export const ftpConfig: IFtpConfig = {
  host: env.FTP_HOST,
  user: env.FTP_USER,
  password: env.FTP_PASSWORD,
  port: env.FTP_PORT,
  secure: env.FTP_SECURE,
  uploadBasePath: env.FTP_UPLOAD_BASE_PATH,
  publicBaseUrl: env.PUBLIC_BASE_URL,
};
