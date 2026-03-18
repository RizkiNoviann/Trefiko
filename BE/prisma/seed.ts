import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 10);

  await prisma.user.deleteMany({
    where: { email: 'cashier@trefiko.com' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@trefiko.com' },
    update: {
      role: 'ADMIN',
    },
    create: {
      name: 'Admin Trefiko',
      email: 'admin@trefiko.com',
      username: 'admin',
      password,
      role: 'ADMIN',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
