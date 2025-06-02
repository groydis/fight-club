import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from '../characters.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateEnrichCharacterService } from '../../openai/queries/generate-character-enrichment.service';
import { CharacterStatus, MoveType } from '@prisma/client';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../../common/tokens';
import { STATIC_USERS } from '../../test-utils/static.users';
import {
  mockEnriched,
  mockSuggestion,
} from '../../test-utils/mock-character.data';
import { createDto, suggestDto } from '../../test-utils/mock-dtos';
import {
  mockFileStorage,
  mockImageGenerator,
} from '../../test-utils/mock-services';

describe('CharactersService', () => {
  let service: CharactersService;

  const mockSuggestionService = {
    execute: jest.fn().mockResolvedValue(mockSuggestion),
  };
  const mockEnrichService = {
    execute: jest.fn().mockResolvedValue(mockEnriched),
  };

  const staticUserId = STATIC_USERS.activeUser1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        PrismaService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: mockSuggestionService,
        },
        {
          provide: GenerateEnrichCharacterService,
          useValue: mockEnrichService,
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
    }).compile();

    service = module.get(CharactersService);
  });

  describe('suggestCharacter', () => {
    it('should return a valid suggestion object', async () => {
      const result = await service.suggestCharacter(suggestDto);
      expect(result).toEqual(mockSuggestion);
    });

    it('should call the suggestion service with name and description', async () => {
      await service.suggestCharacter(suggestDto);
      expect(mockSuggestionService.execute).toHaveBeenCalledWith(
        suggestDto.name,
        suggestDto.description,
      );
    });

    it('should return exactly 6 basic and 6 special moves', async () => {
      const result = await service.suggestCharacter(suggestDto);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });

    it('should ensure each move has a name and valid category', async () => {
      const result = await service.suggestCharacter(suggestDto);
      const validCategories = [
        'strength',
        'agility',
        'intelligence',
        'charisma',
        'luck',
        'constitution',
      ];

      for (const move of [...result.basicMoves, ...result.specialMoves]) {
        expect(move.name).toBeDefined();
        expect(validCategories).toContain(move.primaryStat);
      }
    });

    it('should ensure the total stat points equal 30', async () => {
      const result = await service.suggestCharacter(suggestDto);
      const total = Object.values(result.stats).reduce(
        (sum, val) => sum + val,
        0,
      );
      expect(total).toBe(30);
    });
  });
  describe('createCharacter', () => {
    afterEach(async () => {
      await service['prisma'].character.deleteMany({
        where: { userId: staticUserId },
      });
    });

    it('should create a new character with enriched data and persist to the DB', async () => {
      const result = await service.createCharacter(createDto, staticUserId);

      // Wait for image generation mock to complete (simulate delay)
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(result).toMatchObject({
        name: createDto.name,
        description: createDto.description,
        userId: staticUserId,
        stats: createDto.stats,
        status: CharacterStatus.PROCESSING,
        lore: mockEnriched.lore,
        moves: [
          expect.objectContaining({
            name: 'Spoon Slam',
            type: MoveType.BASIC,
            effectValue: 20,
            description: 'Hits hard with broth-laced power.',
          }),
          expect.objectContaining({
            name: 'Slippery Swipe',
            type: MoveType.BASIC,
            effectValue: 15,
            description: 'Slips through defense like oil.',
          }),
          expect.objectContaining({
            name: 'Boil Over',
            type: MoveType.SPECIAL,
            effectValue: 40,
            description: 'Unleashes molten gravy.',
          }),
          expect.objectContaining({
            name: 'Gravy Geyser',
            type: MoveType.SPECIAL,
            effectValue: 35,
            description: 'Erupts in seasoned fury.',
          }),
        ],
      });

      expect(result.moves).toHaveLength(4);

      expect(mockEnrichService.execute).toHaveBeenCalledWith(createDto);

      expect(mockImageGenerator.execute).toHaveBeenCalledWith({
        name: createDto.name,
        description: createDto.description,
        lore: mockEnriched.lore,
        stats: createDto.stats,
      });

      expect(mockFileStorage.upload).toHaveBeenCalledTimes(3);

      const persisted = await service['prisma'].character.findUnique({
        where: { id: result.id },
      });
      expect(persisted?.userId).toBe(staticUserId);
    });
  });
});
