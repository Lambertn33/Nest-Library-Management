import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'admin12345',
      role: Role.ADMIN,
    },
    {
      name: 'User',
      email: 'user@gmail.com',
      password: 'user12345',
      role: Role.USER,
    },
    {
      name: 'Lamb',
      email: 'lamb@gmail.com',
      password: 'lamb12345',
      role: Role.USER,
    },
  ];

  for (const user of users) {
    let hashedPassword = await bcrypt.hash(user.password, 12);

    let check = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (!check) {
      await prisma.user.create({
        data: {
          email: user.email,
          names: user.name,
          password: hashedPassword,
          role: user.role,
        },
      });
    }
  }

  for (let i = 1; i <= 40; i++) {
    let check = await prisma.book.findFirst({
      where: { title: `Book ${i}` },
    });

    if (!check) {
      await prisma.book.create({
        data: {
          title: `Book ${i}`,
          description: `Description of book ${i}`,
          author: `Author ${i}`,
          book_no: `book_no_${i}`,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
