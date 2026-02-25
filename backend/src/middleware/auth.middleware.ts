import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../interfaces';
import { IAuthTokenPayload, IUserRole } from '../interfaces';
import { ApiError } from '../utils';
import { env } from '../config/env';
import { ERROR_MESSAGES } from '../constants';

export const authenticate = (req: IAuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as IAuthTokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized(ERROR_MESSAGES.TOKEN_EXPIRED));
    }
    next(ApiError.unauthorized(ERROR_MESSAGES.TOKEN_INVALID));
  }
};

export const authorize =
  (...roles: IUserRole[]) =>
  (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(ERROR_MESSAGES.FORBIDDEN));
    }

    next();
  };

export const superAdminOnly = authorize(IUserRole.SUPER_ADMIN);
export const adminOrMiniAdmin = authorize(IUserRole.SUPER_ADMIN, IUserRole.MINI_ADMIN);
