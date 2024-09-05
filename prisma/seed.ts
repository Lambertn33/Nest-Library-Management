import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin12345';

  // Check if the admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        names: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
  } else {
    console.log('Admin already exists');
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
