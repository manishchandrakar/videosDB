import path from 'path';
import { defineConfig } from 'prisma/config';
import { PrismaPostgres } from '@prisma/adapter-pg';
import 'dotenv/config';

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    adapter(env: NodeJS.ProcessEnv) {
      const url = env['DATABASE_URL'];
      if (!url) throw new Error('DATABASE_URL environment variable is not set');
      return new PrismaPostgres({ url });
    },
  },
});
