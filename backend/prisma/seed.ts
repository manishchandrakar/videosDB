import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@admin.com';
  const password = 'Admin@1234';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Super admin already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username: 'superadmin',
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super admin created successfully:');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${user.role}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
