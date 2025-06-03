import { Test, TestingModule } from '@nestjs/testing';
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
import { CreateCharacterService } from '../services/create-character.service';
import { CreateCharacterSuggestionService } from '../services/create-character-suggestion.service';
import { CharacterController } from '../character.controller';

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
  let controller: CharacterController;
  let createCharacterService: CreateCharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        CreateCharacterSuggestionService,
        CreateCharacterService,
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

    controller = module.get<CharacterController>(CharacterController);
    createCharacterService = module.get<CreateCharacterService>(
      CreateCharacterService,
    );
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
