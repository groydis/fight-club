import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { ListCharactersService } from '../list-characters.service';
import { faker } from '@faker-js/faker';
import { CharacterStatus, UserRole, UserStatus } from '@prisma/client';

describe('ListCharactersService', () => {
  let service: ListCharactersService;
  let testUserId: string;
  let char1Id: string;
  let char2Id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListCharactersService, PrismaService],
    }).compile();

    service = module.get(ListCharactersService);
    testUserId = faker.string.uuid();
    char1Id = faker.string.uuid();
    char2Id = faker.string.uuid();

    const testUserEmail = faker.internet.exampleEmail();

    await service['prisma'].user.create({
      data: {
        id: testUserId,
        name: 'authyBoy',
        email: testUserEmail,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    const testCharacters = [
      {
        id: char1Id,
        name: 'Gravy Wizard',
        description: 'A wizard of the sauce arts',
        stats: {
          strength: 5,
          agility: 5,
          intelligence: 5,
          charisma: 5,
          luck: 5,
          constitution: 5,
        },
        status: CharacterStatus.READY,
        lore: 'Master of the gravy realm',
        imageProfileUrl: 'https://cdn/test1.png',
        userId: testUserId,
      },
      {
        id: char2Id,
        name: 'Sauce Goblin',
        description: 'Lurks in condiment caves',
        stats: {
          strength: 5,
          agility: 5,
          intelligence: 5,
          charisma: 5,
          luck: 5,
          constitution: 5,
        },
        status: CharacterStatus.PROCESSING,
        lore: 'Greedy for all things saucy',
        imageProfileUrl: 'https://cdn/test2.png',
        userId: testUserId,
      },
    ];

    for (const char of testCharacters) {
      await service['prisma'].character.create({ data: char });
    }
  });

  afterEach(async () => {
    await service['prisma'].character.deleteMany({
      where: { userId: testUserId },
    });
    await service['prisma'].user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('should return characters belonging to a user in descending order of creation', async () => {
    const result = await service.execute({ userId: testUserId });

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);

    expect(result.items[0].id).toBe(char2Id);
    expect(result.items[1].id).toBe(char1Id);

    expect(result.items[0]).toMatchObject({
      id: char2Id,
      name: 'Sauce Goblin',
      imageProfileUrl: 'https://cdn/test2.png',
      status: CharacterStatus.PROCESSING,
    });

    expect(result.items[1]).toMatchObject({
      id: char1Id,
      name: 'Gravy Wizard',
      imageProfileUrl: 'https://cdn/test1.png',
      status: CharacterStatus.READY,
    });
  });

  it('should not return characters that are archived', async () => {
    await service['prisma'].character.update({
      where: { id: char2Id },
      data: { archived: true },
    });

    const result = await service.execute({ userId: testUserId });

    expect(result.items).toHaveLength(1);
    expect(result.totalCount).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);

    expect(result.items[0].id).toBe(char1Id);
    expect(result.items[0]).toMatchObject({
      id: char1Id,
      name: 'Gravy Wizard',
      imageProfileUrl: 'https://cdn/test1.png',
      status: CharacterStatus.READY,
    });
  });
});
