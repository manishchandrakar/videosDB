import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { IApiErrorResponse } from '../interfaces';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: JSON.stringify(req.body),
  });

  if (err instanceof ApiError) {
    const response: IApiErrorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
      ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: IApiErrorResponse = {
    success: false,
    statusCode: 500,
    message: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
    ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
  };
  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.path} not found`));
};
