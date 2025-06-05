import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { ListCharactersService } from '../list-characters.service';
import { faker } from '@faker-js/faker/.';
import { CharacterStatus, UserRole, UserStatus } from '@prisma/client';

describe('ListCharactersService', () => {
  let service: ListCharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListCharactersService, PrismaService],
    }).compile();

    service = module.get(ListCharactersService);
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

    it('should return characters belonging to a user in descending order of creation', async () => {
      const result = await service.execute(testUserId);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('char-002');
      expect(result[1].id).toBe('char-001');
      // TODO: We have changed the type so we need todo a more thourough check
      expect(result[0]).toMatchObject({
        id: 'char-002',
        name: 'Sauce Goblin',
        imageProfileUrl: 'https://cdn/test2.png',
        status: CharacterStatus.PROCESSING,
      });
      expect(result[1]).toMatchObject({
        id: 'char-001',
        name: 'Gravy Wizard',
        imageProfileUrl: 'https://cdn/test1.png',
        status: CharacterStatus.READY,
      });
    });
  });
});
