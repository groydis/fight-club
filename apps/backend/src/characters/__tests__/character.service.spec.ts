import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from '../character.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../../openai/types/character.types';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateEnrichCharacterService } from '../../openai/queries/generate-character-enrichment.service';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { CharacterStatus, MoveType } from '@prisma/client';

describe('CharactersService', () => {
  let service: CharactersService;
  const mockSuggestion: CharacterSuggestion = {
    stats: {
      strength: 10,
      agility: 10,
      intelligence: 3,
      charisma: 2,
      luck: 3,
      constitution: 2,
    },
    basicMoves: [
      { name: 'Soup Slap', primaryStat: 'strength' },
      { name: 'Breadstick Jab', primaryStat: 'agility' },
      { name: 'Crouton Kick', primaryStat: 'strength' },
      { name: 'Boil Punch', primaryStat: 'constitution' },
      { name: 'Salt Fling', primaryStat: 'luck' },
      { name: 'Spoon Stab', primaryStat: 'charisma' },
    ],
    specialMoves: [
      { name: 'Boil Over', primaryStat: 'constitution' },
      { name: 'Ladle of Justice', primaryStat: 'strength' },
      { name: 'Steam Surge', primaryStat: 'intelligence' },
      { name: 'Molten Splash', primaryStat: 'strength' },
      { name: 'Final Simmer', primaryStat: 'luck' },
      { name: 'Salty Smile', primaryStat: 'charisma' },
    ],
  };

  const mockEnriched = {
    lore: 'Forged in the depths of a forgotten soup kitchen.',
    basicMoves: [
      {
        name: 'Spoon Slam',
        description: 'Hits hard with broth-laced power.',
        effectValue: 20,
      },
      {
        name: 'Slippery Swipe',
        description: 'Slips through defense like oil.',
        effectValue: 15,
      },
    ],
    specialMoves: [
      {
        name: 'Boil Over',
        description: 'Unleashes molten gravy.',
        effectValue: 40,
      },
      {
        name: 'Gravy Geyser',
        description: 'Erupts in seasoned fury.',
        effectValue: 35,
      },
    ],
  };

  const mockSuggestionService = {
    execute: jest.fn().mockResolvedValue(mockSuggestion),
  };
  const mockEnrichService = {
    execute: jest.fn().mockResolvedValue(mockEnriched),
  };

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
      ],
    }).compile();

    service = module.get(CharactersService);
  });

  describe('suggestCharacter', () => {
    const dto: SuggestCharacterStatsDto = {
      name: 'Groovy Gravy',
      description: 'A soup-slinging menace with a poetic soul.',
    };

    it('should return a valid suggestion object', async () => {
      const result = await service.suggestCharacter(dto);
      expect(result).toEqual(mockSuggestion);
    });

    it('should call the suggestion service with name and description', async () => {
      await service.suggestCharacter(dto);
      expect(mockSuggestionService.execute).toHaveBeenCalledWith(
        dto.name,
        dto.description,
      );
    });

    it('should return exactly 6 basic and 6 special moves', async () => {
      const result = await service.suggestCharacter(dto);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });

    it('should ensure each move has a name and valid category', async () => {
      const result = await service.suggestCharacter(dto);
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
      const result = await service.suggestCharacter(dto);
      const total = Object.values(result.stats).reduce(
        (sum, val) => sum + val,
        0,
      );
      console.log('Total stats:', total);
      expect(total).toBe(30);
    });
  });
  describe('createCharacter', () => {
    const dto: CreateCharacterDto = {
      name: 'Groovy Gravy',
      description: 'A soup-slinging menace with a poetic soul.',
      stats: {
        strength: 6,
        agility: 6,
        intelligence: 5,
        charisma: 4,
        luck: 5,
        constitution: 4,
      },
      basicMoves: [
        { name: 'Spoon Slam', primaryStat: 'strength' },
        { name: 'Slippery Swipe', primaryStat: 'agility' },
      ],
      specialMoves: [
        { name: 'Boil Over', primaryStat: 'intelligence' },
        { name: 'Gravy Geyser', primaryStat: 'luck' },
      ],
    };

    it('should create a new character with enriched data and persist to the DB', async () => {
      const result = await service.createCharacter(dto);

      expect(result).toMatchObject({
        name: dto.name,
        description: dto.description,
        lore: mockEnriched.lore,
        status: CharacterStatus.PROCESSING,
        stats: dto.stats,
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

      expect(mockEnrichService.execute).toHaveBeenCalledWith(dto);

      // Optional: Clean up the created character if needed
      await service['prisma'].character.delete({ where: { id: result.id } });
    });
  });
});
