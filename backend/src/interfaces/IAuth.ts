import { IUserRole } from './IUser';

export interface IAuthLoginInput {
  email: string;
  password: string;
}

export interface IAuthTokenPayload {
  userId: string;
  email: string;
  role: IUserRole;
  iat?: number;
  exp?: number;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthLoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: IUserRole;
  };
  tokens: IAuthTokens;
}
