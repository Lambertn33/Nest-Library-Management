import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
