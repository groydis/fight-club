import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from '../character.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../../openai/types/character.types';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';

describe('CharactersService', () => {
  let service: CharactersService;

  const mockSuggestion: CharacterSuggestion = {
    stats: {
      strength: 6,
      agility: 4,
      intelligence: 3,
      charisma: 2,
      luck: 3,
      constitution: 2,
    },
    basicMoves: [
      { name: 'Soup Slap' },
      { name: 'Breadstick Jab' },
      { name: 'Crouton Kick' },
      { name: 'Boil Punch' },
      { name: 'Salt Fling' },
    ],
    specialMoves: [
      { name: 'Boil Over' },
      { name: 'Ladle of Justice' },
      { name: 'Steam Surge' },
      { name: 'Molten Splash' },
      { name: 'Final Simmer' },
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

  it('should return character suggestions from the AI suggestion service', async () => {
    const dto: SuggestCharacterStatsDto = {
      name: 'Groovy Gravy',
      description: 'A soup-slinging menace with a poetic soul.',
    };

    const result = await service.suggestCharacter(dto);

    expect(result).toEqual(mockSuggestion);
    expect(mockSuggestionService.execute).toHaveBeenCalledWith(
      dto.name,
      dto.description,
    );
  });
});
