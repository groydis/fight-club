import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../character.controller';
import { CharactersService } from '../character.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';
import { CharacterSuggestion } from '../../openai/types/character.types';

describe('CharactersController', () => {
  let controller: CharactersController;

  const mockSuggestion: CharacterSuggestion = {
    stats: {
      strength: 10,
      agility: 10,
      intelligence: 3,
      charisma: 2,
      luck: 2,
      constitution: 3,
    },
    basicMoves: [
      { name: 'Soup Slap', category: 'strength' },
      { name: 'Breadstick Jab', category: 'agility' },
      { name: 'Crouton Kick', category: 'strength' },
      { name: 'Boil Punch', category: 'constitution' },
      { name: 'Salt Fling', category: 'luck' },
      { name: 'Salt Toss', category: 'agility' },
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

  const mockSuggestionsService = {
    execute: jest.fn().mockResolvedValue(mockSuggestion),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        CharactersService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: mockSuggestionsService,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
  });

  it('should return mocked character suggestions without calling OpenAI', async () => {
    const dto: SuggestCharacterStatsDto = {
      name: 'Groovy Gravy',
      description: 'Heavily seasoned, lightly unhinged.',
    };

    const result = await controller.suggestCharacter(dto);

    expect(result.stats).toEqual(mockSuggestion.stats);
    expect(Object.values(result.stats).reduce((a, b) => a + b, 0)).toBe(30);
    expect(result.basicMoves).toHaveLength(6);
    expect(result.specialMoves).toHaveLength(6);
    expect(mockSuggestionsService.execute).toHaveBeenCalledWith(
      dto.name,
      dto.description,
    );
  });
});
