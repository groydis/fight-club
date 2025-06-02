import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../characters.controller';
import { CharactersService } from '../characters.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { GenerateEnrichCharacterService } from '../../openai/queries/generate-character-enrichment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CharacterStatus, MoveType } from '@prisma/client';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../../common/tokens';
import {
  mockEnriched,
  mockSuggestion,
} from '../../test-utils/mock-character.data';
import { createDto, suggestDto } from '../../test-utils/mock-dtos';
import { AuthenticatedRequest } from '../../common/types/extended-request';
import {
  AllowAllAuthGuard,
  local,
  mockSupabaseUser,
} from '../../test-utils/mock-auth.guard';
import { AuthGuard } from '../../auth/auth.guard';
import {
  createMockAuthUser,
  MockAuthUser,
} from '../../test-utils/create-mock-auth-user';

const mockImageGenerator = {
  execute: jest.fn().mockResolvedValue({
    front: Buffer.from('mock front'),
    back: Buffer.from('mock back'),
    profile: Buffer.from('mock profile'),
  }),
};

const mockFileStorage = {
  upload: jest.fn().mockResolvedValue('https://example.com/mock-image.png'),
};

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        CharactersService,
        PrismaService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: { execute: jest.fn().mockResolvedValue(mockSuggestion) },
        },
        {
          provide: GenerateEnrichCharacterService,
          useValue: { execute: jest.fn().mockResolvedValue(mockEnriched) },
        },
        {
          provide: CHARACTER_IMAGE_GENERATOR,
          useValue: mockImageGenerator,
        },
        {
          provide: FILE_STORAGE,
          useValue: mockFileStorage,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(AllowAllAuthGuard)
      .compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  describe('getCharacters', () => {
    let testUser: MockAuthUser;
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
      },
    ];

    beforeEach(async () => {
      testUser = await createMockAuthUser(service['prisma']);
      for (const char of testCharacters) {
        await service['prisma'].character.create({
          data: { ...char, userId: testUser.id },
        });
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

      const result = await controller.getCharacters(req);

      expect(result).toHaveLength(2);

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

  describe('suggestCharacter', () => {
    it('returns a valid suggestion object from the controller', async () => {
      const result = await controller.suggestCharacter(suggestDto);

      expect(result.stats).toEqual(mockSuggestion.stats);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });
  });

  describe('createCharacter', () => {
    const mockRequest = {
      user: {
        local,
        supabase: mockSupabaseUser,
      },
    } as unknown as AuthenticatedRequest;

    afterEach(async () => {
      await service['prisma'].character.deleteMany();
    });

    it('persists a new character and returns the DTO', async () => {
      const result = await controller.create(createDto, mockRequest);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(result).toMatchObject({
        name: createDto.name,
        description: createDto.description,
        lore: mockEnriched.lore,
        status: CharacterStatus.PROCESSING,
        stats: createDto.stats,
      });

      expect(result.moves).toHaveLength(4);
      expect(result.moves).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Spoon Slam',
            type: MoveType.BASIC,
            effectValue: 20,
          }),
          expect.objectContaining({
            name: 'Boil Over',
            type: MoveType.SPECIAL,
            effectValue: 40,
          }),
        ]),
      );

      expect(mockImageGenerator.execute).toHaveBeenCalledWith({
        name: createDto.name,
        description: createDto.description,
        lore: mockEnriched.lore,
        stats: createDto.stats,
      });

      expect(mockFileStorage.upload).toHaveBeenCalledTimes(3);
    });
  });
});
