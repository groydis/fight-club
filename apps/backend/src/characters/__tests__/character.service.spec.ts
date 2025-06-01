import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from '../character.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../../openai/types/character.types';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';

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
      { name: 'Soup Slap', category: 'strength' },
      { name: 'Breadstick Jab', category: 'agility' },
      { name: 'Crouton Kick', category: 'strength' },
      { name: 'Boil Punch', category: 'constitution' },
      { name: 'Salt Fling', category: 'luck' },
      { name: 'Spoon Stab', category: 'charisma' },
    ],
    specialMoves: [
      { name: 'Boil Over', category: 'constitution' },
      { name: 'Ladle of Justice', category: 'strength' },
      { name: 'Steam Surge', category: 'intelligence' },
      { name: 'Molten Splash', category: 'strength' },
      { name: 'Final Simmer', category: 'luck' },
      { name: 'Salty Smile', category: 'charisma' },
    ],
  };

  const mockSuggestionService = {
    execute: jest.fn().mockResolvedValue(mockSuggestion),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: mockSuggestionService,
        },
      ],
    }).compile();

    service = module.get(CharactersService);
  });

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
      expect(validCategories).toContain(move.category);
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
