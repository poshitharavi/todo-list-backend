import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { departments } from './departments';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Seeding...');

  try {
    const plainPassword = 'password';
    const hashedPassword = await hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        email: 'admin@sample.com',
        password: hashedPassword,
        firstName: 'Platform',
        lastName: 'Admin',
        role: 'admin',
      },
    });

    console.log(`\n Admin User created`);
  } catch (error) {
    console.error(error);
  }

  try {
    await prisma.department.createMany({
      data: departments,
      skipDuplicates: true,
    });
    console.log(`\n Departments are inserted`);
  } catch (error) {
    console.error(error);
  }

  console.log(`\n Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
