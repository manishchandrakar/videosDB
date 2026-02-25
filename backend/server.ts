import app from './app';
import { env } from './src/config/env';
import { connectDatabase, disconnectDatabase } from './src/config/database';
import { logger } from './src/utils/logger';

const startServer = async (): Promise<void> => {
  await connectDatabase();

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
