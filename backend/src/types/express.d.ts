import { IAuthTokenPayload } from '../interfaces/IAuth';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthTokenPayload;
      uploadedFileUrl?: string;
      thumbnailUrl?: string;
    }
  }
}

export {};
