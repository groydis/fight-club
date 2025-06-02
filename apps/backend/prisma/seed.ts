import { UserRole, UserStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Dev One Account
  const STATIC_USERS = [
    {
      id: '38597745-140b-460e-a41f-46cd0acea339',
      name: 'Dev One',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: '0d9ff8c4-28b1-4c17-bfe0-d9f8e2c3ad01',
      name: 'User ACTIVE',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'c3f14452-5ec6-4d27-a3d2-497a9721d2b2',
      name: 'User PENDING',
      status: UserStatus.PENDING,
      role: UserRole.USER,
    },
    {
      id: 'ab93ae6b-f458-4959-9a8f-5cde9bfae361',
      name: 'User INACTIVE',
      status: UserStatus.INACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'efff893e-7535-42b3-ae68-b3c478c4e7cb',
      name: 'User BANNED',
      status: UserStatus.BANNED,
      role: UserRole.USER,
    },
    {
      id: 'af1130f9-d2f2-4b2e-9b4b-4d5ed43869f1',
      name: 'Active USER',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'bdbb112e-6ef9-4551-a8b3-d90bcd3fbcf7',
      name: 'Active MODERATOR',
      status: UserStatus.ACTIVE,
      role: UserRole.MODERATOR,
    },
    {
      id: 'fa8432cc-c2f4-41d5-988b-37d1b0ef8d7f',
      name: 'Active ADMIN',
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    },
  ];

  for (const user of STATIC_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  console.log('🌱 Seed data inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
