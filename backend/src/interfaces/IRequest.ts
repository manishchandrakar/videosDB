import { Request } from 'express';
import { IAuthTokenPayload } from './IAuth';

export interface IAuthRequest extends Request {
  user?: IAuthTokenPayload;
}

export interface IFileRequest extends IAuthRequest {
  uploadedFileUrl?: string;
  thumbnailUrl?: string;
}
