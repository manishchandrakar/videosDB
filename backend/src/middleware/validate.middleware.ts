import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils';

type IValidationTarget = 'body' | 'query' | 'params';

export const validate =
  (schema: Joi.ObjectSchema, target: IValidationTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    }) as { error: Joi.ValidationError | undefined; value: Record<string, unknown> };

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    if (target === 'query') {
      Object.keys(req.query).forEach((key) => delete (req.query as Record<string, unknown>)[key]);
      Object.assign(req.query, value);
    } else {
      req[target] = value;
    }
    next();
  };
