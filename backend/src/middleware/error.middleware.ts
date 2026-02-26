import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { IApiErrorResponse } from '../interfaces';

const isDev = process.env['NODE_ENV'] !== 'production';

/** Map a Prisma known-request error to an ApiError with the right HTTP status */
function prismaToApiError(err: Prisma.PrismaClientKnownRequestError): ApiError {
  switch (err.code) {
    case 'P2002': {
      const fields = (err.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'field';
      return ApiError.conflict(`A record with this ${fields} already exists.`);
    }
    case 'P2025':
      return ApiError.notFound('Record not found.');
    case 'P2003':
      return ApiError.badRequest('Related record not found (foreign key constraint failed).');
    case 'P2014':
      return ApiError.badRequest('The change violates a required relation.');
    case 'P2000':
      return ApiError.badRequest('Input value is too long for this field.');
    case 'P2011':
      return ApiError.badRequest('A required field is missing a value.');
    default:
      return ApiError.internal('Database operation failed.');
  }
}

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

  // ── Our own structured errors ────────────────────────────────────────────
  if (err instanceof ApiError) {
    const response: IApiErrorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
      ...(isDev && { stack: err.stack }),
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // ── Prisma: known DB errors (unique, not found, FK, …) ──────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const apiErr = prismaToApiError(err);
    const response: IApiErrorResponse = {
      success: false,
      statusCode: apiErr.statusCode,
      message: apiErr.message,
      ...(isDev && { stack: err.stack }),
    };
    res.status(apiErr.statusCode).json(response);
    return;
  }

  // ── Prisma: bad query / wrong types sent to Prisma client ────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    const response: IApiErrorResponse = {
      success: false,
      statusCode: 400,
      message: 'Invalid data provided.',
      ...(isDev && { stack: err.stack }),
    };
    res.status(400).json(response);
    return;
  }

  // ── Prisma: cannot reach the database ───────────────────────────────────
  if (err instanceof Prisma.PrismaClientInitializationError) {
    const response: IApiErrorResponse = {
      success: false,
      statusCode: 503,
      message: 'Service temporarily unavailable. Please try again later.',
    };
    res.status(503).json(response);
    return;
  }

  // ── Fallback for any unhandled error ────────────────────────────────────
  const response: IApiErrorResponse = {
    success: false,
    statusCode: 500,
    message: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack }),
  };
  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.path} not found`));
};
