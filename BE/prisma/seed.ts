import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reviewComments = [
  'Kopinya enak dan pelayanan cepat, bakal balik lagi.',
  'Tempat nyaman buat kerja, suasana juga tenang.',
  'Makanan oke, porsi pas dan harga masih masuk.',
  'Barista ramah, latte art-nya keren banget.',
  'Menu variatif, favorit saya kopi susu gula aren.',
  'Pesanan datang rapi dan masih hangat.',
  'Vibenya asik buat nongkrong sore sama teman.',
  'Rasa konsisten dari kunjungan sebelumnya.',
  'Staff responsif dan cukup membantu saat ramai.',
  'Overall puas, recommended untuk jadi langganan.',
];

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

  const existingRizkiByUsername = await prisma.user.findUnique({
    where: { username: 'rizki' },
  });

  const rizki = existingRizkiByUsername
    ? await prisma.user.update({
        where: { id: existingRizkiByUsername.id },
        data: {
          name: 'Rizki Novian',
          role: 'USER',
        },
      })
    : await prisma.user.upsert({
        where: { email: 'rizki@trefiko.com' },
        update: {
          name: 'Rizki Novian',
          username: 'rizki',
          role: 'USER',
        },
        create: {
          name: 'Rizki Novian',
          email: 'rizki@trefiko.com',
          username: 'rizki',
          password,
          role: 'USER',
        },
      });

  // Keep seeding idempotent: clear old test orders/reviews for Rizki before recreating.
  await prisma.order.deleteMany({
    where: { userId: rizki.id },
  });

  let menu = await prisma.menu.findFirst({
    where: { status: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!menu) {
    menu = await prisma.menu.create({
      data: {
        image: '/images/default-seed-menu.png',
        title: 'Kopi Susu Seed',
        description: 'Menu seed untuk data review testing',
        category: 'COFFEE',
        price: 18000,
        status: true,
        favorite: false,
      },
    });
  }

  for (let i = 0; i < 10; i += 1) {
    const order = await prisma.order.create({
      data: {
        code: `RIZKI-REVIEW-${String(i + 1).padStart(2, '0')}`,
        userId: rizki.id,
        payment: 'COD',
        status: 'COMPLETED',
        note: 'Data seed review untuk pengujian',
        totalAmount: 18000,
        items: {
          create: [
            {
              menuId: menu.id,
              quantity: 1,
              temperature: 'iced',
              unitPrice: 18000,
              lineTotal: 18000,
            },
          ],
        },
      },
    });

    const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);

    await prisma.review.create({
      data: {
        userId: rizki.id,
        orderId: order.id,
        rating: 5 - (i % 2),
        comment: reviewComments[i],
        createdAt,
      },
    });
  }

  console.log('Seed selesai: admin + user Rizki + 10 review test dibuat.');
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
