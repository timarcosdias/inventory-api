import { PrismaClient } from '@prisma/client';
import roles from './data/roles';
import users from './data/users';
const prisma = new PrismaClient();

async function main() {
  for (const role of roles) {
    const result = await prisma.role.create({ data: role });
    console.log(`Created role with id ${result.id}`);
  }

  for (const user of users) {
    const result = await prisma.user.create({ data: user });
    console.log(`Created user with id ${result.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
