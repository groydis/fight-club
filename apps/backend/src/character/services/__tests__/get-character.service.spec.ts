import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { faker } from '@faker-js/faker/.';
import { CharacterStatus, UserRole, UserStatus } from '@prisma/client';
import { GetCharacterService } from '../get-character.service';

describe('ListCharactersService', () => {
  let service: GetCharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetCharacterService, PrismaService],
    }).compile();

    service = module.get(GetCharacterService);
  });

  describe('execute', () => {
    const testUserId = faker.string.uuid();
    const testUserEmail = faker.internet.exampleEmail();
    const testCharacters = [
      {
        id: 'char-001',
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
        id: 'char-002',
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

    beforeEach(async () => {
      await service['prisma'].user.create({
        data: {
          id: testUserId,
          name: 'authyBoy',
          email: testUserEmail,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
        },
      });
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

    it('should return belonging to a user with the correct id', async () => {
      const result = await service.execute(testUserId, 'char-001');
      expect(result.id).toBe('char-001');
      expect(result).toMatchObject({
        id: 'char-001',
        name: 'Gravy Wizard',
        imageProfileUrl: 'https://cdn/test1.png',
        status: CharacterStatus.READY,
      });
    });
  });
});
