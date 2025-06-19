import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../characters.controller';
import { ListCharactersService } from '../services/list-characters.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AllowAllAuthGuard } from '../../test-utils/mock-auth.guard';
import {
  createMockAuthUser,
  MockAuthUser,
} from '../../test-utils/create-mock-auth-user';
import { CharacterStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../../common/types/extended-request';
import { faker } from '@faker-js/faker';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: ListCharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [ListCharactersService, PrismaService],
    })
      .overrideGuard(AuthGuard)
      .useClass(AllowAllAuthGuard)
      .compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<ListCharactersService>(ListCharactersService);
  });

  describe('GET /characters', () => {
    let testUser: MockAuthUser;
    let char1Id: string;
    let char2Id: string;

    beforeEach(async () => {
      char1Id = faker.string.uuid();
      char2Id = faker.string.uuid();

      testUser = await createMockAuthUser(service['prisma']);

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
          userId: testUser.id,
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
          userId: testUser.id,
        },
      ];

      for (const char of testCharacters) {
        await service['prisma'].character.create({ data: char });
      }
    });

    afterEach(async () => {
      await service['prisma'].character.deleteMany({
        where: { userId: testUser.id },
      });
    });

    it('returns characters belonging to the authenticated user', async () => {
      const req = {
        user: { ...testUser.requestUser },
      } as unknown as AuthenticatedRequest;

      const result = await controller.getCharacters(
        req,
        undefined,
        undefined,
        undefined,
        undefined,
        testUser.id,
      );

      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);

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
  });
});
