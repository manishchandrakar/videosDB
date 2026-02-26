import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { IAuthLoginInput, IAuthRequest, IUserCreateInput, IUserRole } from '../interfaces';

export const login = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const result = await authService.login(req.body as IAuthLoginInput);
    ApiResponse.ok(res, 'Login successful', result);
  }
);

export const register = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const body = req.body as IUserCreateInput;
    // Mini admins can only create MINI_ADMIN users
    if (req.user!.role === IUserRole.MINI_ADMIN) {
      body.role = IUserRole.MINI_ADMIN;
    }
    const user = await authService.register(body);
    ApiResponse.created(res, 'User registered successfully', user);
  }
);

export const refreshTokens = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(refreshToken);
    ApiResponse.ok(res, 'Tokens refreshed', tokens);
  }
);

export const changePassword = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    ApiResponse.ok(res, 'Password changed successfully');
  }
);

export const me = asyncHandler((req: IAuthRequest, res: Response, _next: NextFunction): void => {
  ApiResponse.ok(res, 'Current user', req.user);
});

export const getUsers = asyncHandler(
  async (_req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const users = await authService.getUsers();
    ApiResponse.ok(res, 'Users retrieved', users);
  }
);

export const deleteUser = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    await authService.deleteUser(id, req.user!.userId);
    ApiResponse.noContent(res);
  }
);

export const toggleBlock = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const user = await authService.toggleBlock(id, req.user!.userId);
    ApiResponse.ok(res, `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user);
  }
);
