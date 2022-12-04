import { PrismaClient } from '@prisma/client';
import { data } from './data';

const prisma = new PrismaClient();

async function main() {
  for (let user of data) {
    await prisma.user.create({
      data: {
        email: user.user.email,
        username: user.user.username,
        password: user.user.password,
        isEmailVerified: user.user.isEmailVerified,
        profile: { create: user.profile },
        posts: { createMany: { data: user.posts } },
      },
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
