import { UserRole, UserStatus, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Dev One Account
  const STATIC_USERS = [
    {
      id: '38597745-140b-460e-a41f-46cd0acea339',
      name: 'Dev One',
      email: 'greyden.scott+dev@gmail.com',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: '0d9ff8c4-28b1-4c17-bfe0-d9f8e2c3ad01',
      name: 'User ACTIVE',
      email: 'personACTIVE@example.com',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'c3f14452-5ec6-4d27-a3d2-497a9721d2b2',
      name: 'User PENDING',
      email: 'personPENDING@example.com',
      status: UserStatus.PENDING,
      role: UserRole.USER,
    },
    {
      id: 'ab93ae6b-f458-4959-9a8f-5cde9bfae361',
      name: 'User INACTIVE',
      email: 'personINACTIVE@example.com',
      status: UserStatus.INACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'efff893e-7535-42b3-ae68-b3c478c4e7cb',
      name: 'User BANNED',
      email: 'personBANNED@example.com',
      status: UserStatus.BANNED,
      role: UserRole.USER,
    },
    {
      id: 'af1130f9-d2f2-4b2e-9b4b-4d5ed43869f1',
      name: 'Active USER',
      email: 'personUSER@example.com',
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    },
    {
      id: 'bdbb112e-6ef9-4551-a8b3-d90bcd3fbcf7',
      name: 'Active MODERATOR',
      email: 'personMODERATOR@example.com',
      status: UserStatus.ACTIVE,
      role: UserRole.MODERATOR,
    },
    {
      id: 'fa8432cc-c2f4-41d5-988b-37d1b0ef8d7f',
      name: 'Active ADMIN',
      email: 'personADMIN@example.com',
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

  const genders = ['Male', 'Female', 'Other', 'Unknown'] as const;
  const alignments = [
    'LawfulGood',
    'NeutralGood',
    'ChaoticGood',
    'LawfulNeutral',
    'TrueNeutral',
    'ChaoticNeutral',
    'LawfulEvil',
    'NeutralEvil',
    'ChaoticEvil',
  ] as const;
  const statKeys = ['strength', 'agility', 'intelligence', 'charisma', 'luck'];

  for (const user of STATIC_USERS.filter(
    (u) => u.status === UserStatus.ACTIVE,
  )) {
    for (let i = 0; i < 25; i++) {
      const char = await prisma.character.create({
        data: {
          name: faker.person.fullName(),
          description: faker.lorem.sentence(),
          lore: faker.lorem.paragraph(),
          stats: {
            strength: faker.number.int({ min: 1, max: 10 }),
            agility: faker.number.int({ min: 1, max: 10 }),
            intelligence: faker.number.int({ min: 1, max: 10 }),
            charisma: faker.number.int({ min: 1, max: 10 }),
            luck: faker.number.int({ min: 1, max: 10 }),
          },
          gender: faker.helpers.arrayElement(genders),
          alignment: faker.helpers.arrayElement(alignments),
          species: 'human',
          userId: user.id,
          imageFrontUrl: '/images/question-mark.png',
          imageProfileUrl: '/images/question-mark.png',
          status: 'READY',
          moves: {
            create: [
              {
                name: faker.word.words({ count: { min: 1, max: 2 } }),
                description: faker.lorem.sentence(),
                stat: faker.helpers.arrayElement(statKeys),
                effectValue: faker.number.int({ min: 1, max: 5 }),
                type: 'BASIC',
              },
              {
                name: faker.word.words({ count: { min: 1, max: 2 } }),
                description: faker.lorem.sentence(),
                stat: faker.helpers.arrayElement(statKeys),
                effectValue: faker.number.int({ min: 3, max: 10 }),
                type: 'SPECIAL',
              },
            ],
          },
        },
      });

      console.log(`Created character ${char.name} for ${user.name}`);
    }
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
