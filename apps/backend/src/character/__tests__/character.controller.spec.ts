import { Test, TestingModule } from '@nestjs/testing';
import { CharacterGenerateSuggestionsService } from '../../services/character-generation/services/character-generate-suggestions.service';
import { CharacterGenerateEnrichmentService } from '../../services/character-generation/services/character-generate-enrichment.service';
import { PrismaService } from '../../services/prisma/prisma.service';
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
import { CreateCharacterService } from '../services/create-character.service';
import { CreateCharacterSuggestionService } from '../services/create-character-suggestion.service';
import { CharacterController } from '../character.controller';
import {
  createMockAuthUser,
  MockAuthUser,
} from '../../test-utils/create-mock-auth-user';
import { GetCharacterService } from '../services/get-character.service';

const mockImageGenerator = {
  execute: jest.fn().mockResolvedValue({
    front: Buffer.from('mock front'),
    profile: Buffer.from('mock profile'),
  }),
};

const mockFileStorage = {
  upload: jest.fn().mockResolvedValue('https://example.com/mock-image.png'),
};

describe('CharactersController', () => {
  let controller: CharacterController;
  let createCharacterService: CreateCharacterService;
  let getCharacterService: GetCharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        GetCharacterService,
        CreateCharacterSuggestionService,
        CreateCharacterService,
        PrismaService,
        {
          provide: CharacterGenerateSuggestionsService,
          useValue: { execute: jest.fn().mockResolvedValue(mockSuggestion) },
        },
        {
          provide: CharacterGenerateEnrichmentService,
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

    controller = module.get<CharacterController>(CharacterController);
    createCharacterService = module.get<CreateCharacterService>(
      CreateCharacterService,
    );
    getCharacterService = module.get<GetCharacterService>(GetCharacterService);
  });

  describe('GET /character', () => {
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
      testUser = await createMockAuthUser(getCharacterService['prisma']);
      for (const char of testCharacters) {
        await getCharacterService['prisma'].character.create({
          data: { ...char, userId: testUser.id },
        });
      }
    });

    afterEach(async () => {
      await getCharacterService['prisma'].character.deleteMany({
        where: { userId: testUser.id },
      });
    });

    it('returns a valid character object from the controller', async () => {
      const req = {
        user: { ...testUser.requestUser },
      } as unknown as AuthenticatedRequest;

      const result = await controller.get(req, 'char-001');

      expect(result).toMatchObject({
        id: 'char-001',
        name: 'Gravy Wizard',
        imageProfileUrl: 'https://cdn/test1.png',
        status: CharacterStatus.READY,
      });
    });
  });

  describe('POST /character/suggestion', () => {
    it('returns a valid suggestion object from the controller', async () => {
      const result = await controller.createCharacterSuggestion(suggestDto);

      expect(result.stats).toEqual(mockSuggestion.stats);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });
  });

  describe('POST /character', () => {
    const mockRequest = {
      user: {
        local,
        supabase: mockSupabaseUser,
      },
    } as unknown as AuthenticatedRequest;

    afterEach(async () => {
      await createCharacterService['prisma'].character.deleteMany();
    });

    it('persists a new character and returns the DTO', async () => {
      const result = await controller.create(createDto, mockRequest);

      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log('Result:', result);
      expect(result).toMatchObject({
        name: createDto.name,
        description: createDto.description,
        lore: mockEnriched.lore,
        status: CharacterStatus.PROCESSING,
        stats: createDto.stats,
        id: expect.any(String),
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
        characterId: result.id,
        visualDescription: mockEnriched.visualDescription,
      });

      expect(mockFileStorage.upload).toHaveBeenCalledTimes(2);
    });
  });
});
