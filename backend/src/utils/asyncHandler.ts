import { Request, Response, NextFunction, RequestHandler } from 'express';

type IAsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const asyncHandler = (fn: IAsyncFn): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
