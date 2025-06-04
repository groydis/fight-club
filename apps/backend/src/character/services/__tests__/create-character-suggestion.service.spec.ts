import { Test, TestingModule } from '@nestjs/testing';
import { CreateCharacterSuggestionService } from '../create-character-suggestion.service';
import { mockSuggestion } from '../../../test-utils/mock-character.data';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { GenerateCharacterSuggestionsService } from '../../../services/character-generation/services/character-generate-suggestions.service';
import { suggestDto } from '../../../test-utils/mock-dtos';

describe('CreateCharacterSuggestionService', () => {
  let service: CreateCharacterSuggestionService;

  const mockSuggestionService = {
    execute: jest.fn().mockResolvedValue(mockSuggestion),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCharacterSuggestionService,
        PrismaService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: mockSuggestionService,
        },
      ],
    }).compile();

    service = module.get(CreateCharacterSuggestionService);
  });

  describe('execute', () => {
    it('should return a valid suggestion object', async () => {
      const result = await service.execute(suggestDto);
      expect(result).toEqual(mockSuggestion);
    });

    it('should call the suggestion service with name and description', async () => {
      await service.execute(suggestDto);
      expect(mockSuggestionService.execute).toHaveBeenCalledWith(
        suggestDto.name,
        suggestDto.description,
      );
    });

    it('should return exactly 6 basic and 6 special moves', async () => {
      const result = await service.execute(suggestDto);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });

    it('should ensure each move has a name and valid category', async () => {
      const result = await service.execute(suggestDto);
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
      const result = await service.execute(suggestDto);
      const total = Object.values(result.stats).reduce(
        (sum, val) => sum + val,
        0,
      );
      expect(total).toBe(30);
    });
  });
});
