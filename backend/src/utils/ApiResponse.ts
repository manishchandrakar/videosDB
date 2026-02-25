import { Response } from 'express';
import { IApiResponse } from '../interfaces';

export class ApiResponse {
  static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ): Response<IApiResponse<T>> {
    const response: IApiResponse<T> = {
      success: statusCode < 400,
      statusCode,
      message,
      ...(data !== undefined && { data }),
    };
    return res.status(statusCode).json(response) as Response<IApiResponse<T>>;
  }

  static ok<T>(res: Response, message: string, data?: T): Response<IApiResponse<T>> {
    return ApiResponse.send(res, 200, message, data);
  }

  static created<T>(res: Response, message: string, data?: T): Response<IApiResponse<T>> {
    return ApiResponse.send(res, 201, message, data);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
