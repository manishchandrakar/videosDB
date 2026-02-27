import app from './app';
import { env } from './src/config/env';
import { connectDatabase, disconnectDatabase, prisma } from './src/config/database';
import { logger } from './src/utils/logger';
import bcrypt from 'bcryptjs';

const ensureSuperAdmin = async (): Promise<void> => {
  const email = 'krish@gmail.com';
  const password = 'Admin@1234';
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'SUPER_ADMIN' },
    create: { username: 'superadmin', email, password: hashedPassword, role: 'SUPER_ADMIN' },
  });
  logger.info(`Super admin ready: ${email}`);
};

const startServer = async (): Promise<void> => {
  await connectDatabase();
  await ensureSuperAdmin();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });

  const gracefulShutdown = (signal: string): void => {
    logger.info(`${signal} received – shutting down gracefully`);
    server.close(() => {
      void disconnectDatabase().then(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason });
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });
};

void startServer();
