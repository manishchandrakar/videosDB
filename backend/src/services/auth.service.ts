import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { CONSTANTS, ERROR_MESSAGES } from '../constants';
import { ApiError } from '../utils/ApiError';
import {
  IAuthLoginInput,
  IAuthLoginResponse,
  IAuthTokenPayload,
  IAuthTokens,
  IUserCreateInput,
  IUserPublic,
  IUserRole,
} from '../interfaces';

export class AuthService {
  private generateTokens(payload: Omit<IAuthTokenPayload, 'iat' | 'exp'>): IAuthTokens {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: CONSTANTS.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: CONSTANTS.JWT_REFRESH_EXPIRES,
    });

    return { accessToken, refreshToken };
  }

  async login(input: IAuthLoginInput): Promise<IAuthLoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.role === IUserRole.USER) {
      throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.isBlocked) {
      throw ApiError.forbidden('Your account has been blocked. Please contact an administrator.');
    }

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as IUserRole,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as IUserRole,
      },
      tokens,
    };
  }

  async signup(input: Omit<IUserCreateInput, 'role'>): Promise<IAuthLoginResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email.toLowerCase() }, { username: input.username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === input.email.toLowerCase() ? 'Email' : 'Username';
      throw ApiError.conflict(ERROR_MESSAGES.ALREADY_EXISTS(field));
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: IUserRole.USER,
      },
    });

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: IUserRole.USER,
    });

    return {
      user: { id: user.id, username: user.username, email: user.email, role: IUserRole.USER },
      tokens,
    };
  }

  async register(input: IUserCreateInput): Promise<IUserPublic> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email.toLowerCase() }, { username: input.username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === input.email ? 'Email' : 'Username';
      throw ApiError.conflict(ERROR_MESSAGES.ALREADY_EXISTS(field));
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: input.role ?? 'MINI_ADMIN',
      },
    });

    const userPublic: IUserPublic = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as IUserRole,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userPublic;
  }

  async refreshTokens(refreshToken: string): Promise<IAuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as IAuthTokenPayload;

      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_INVALID);
      }

      return this.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role as IUserRole,
      });
    } catch {
      throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw ApiError.unauthorized('Current password is incorrect');

    const hashedNew = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedNew } });
  }

  async getUsers(): Promise<IUserPublic[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => ({ ...u, role: u.role as IUserRole }));
  }

  async toggleBlock(targetId: string, requesterId: string): Promise<IUserPublic> {
    if (targetId === requesterId) {
      throw ApiError.badRequest('You cannot block your own account');
    }
    const user = await prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('User'));

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { isBlocked: !user.isBlocked },
    });

    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role as IUserRole,
      isBlocked: updated.isBlocked,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteUser(targetId: string, requesterId: string): Promise<void> {
    if (targetId === requesterId) {
      throw ApiError.badRequest('You cannot delete your own account');
    }
    const user = await prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('User'));
    await prisma.user.delete({ where: { id: targetId } });
  }
}

export const authService = new AuthService();
