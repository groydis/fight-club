import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCharacterSuggestionsService } from '../queries/generate-character-suggestions.service';
import { ChatGptService } from '../openai.service';
import { CharacterSuggestion } from '../types/character.types';

describe('GenerateCharacterSuggestionsService', () => {
  let service: GenerateCharacterSuggestionsService;

  const validSuggestion: CharacterSuggestion = {
    stats: {
      strength: 6,
      agility: 3,
      intelligence: 3,
      charisma: 2,
      luck: 3,
      constitution: 3,
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

  const mockChatGptService = {
    chatGptRequest: jest.fn().mockResolvedValue(validSuggestion),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCharacterSuggestionsService,
        {
          provide: ChatGptService,
          useValue: mockChatGptService,
        },
      ],
    }).compile();

    service = module.get(GenerateCharacterSuggestionsService);
  });

  it('should return valid character suggestions', async () => {
    const result = await service.execute(
      'Groovy Gravy',
      'Unhinged soup warrior',
    );

    expect(result.stats).toEqual(validSuggestion.stats);
    expect(Object.values(result.stats).reduce((a, b) => a + b)).toBe(20);
    expect(result.basicMoves.length).toBe(5);
    expect(result.specialMoves.length).toBe(5);
  });

  it('should throw if stat total is not 20', async () => {
    const brokenStats: CharacterSuggestion = {
      ...validSuggestion,
      stats: {
        ...validSuggestion.stats,
        strength: 10,
        luck: 9, // now total = 26
      },
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(brokenStats);

    await expect(
      service.execute('Overpowered Chad', 'Stat cheater'),
    ).rejects.toThrow('Failed to generate character suggestion');
  });

  it('should throw if there are not exactly 5 moves of each type', async () => {
    const brokenMoves: CharacterSuggestion = {
      ...validSuggestion,
      basicMoves: validSuggestion.basicMoves.slice(0, 3), // only 3 moves
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(brokenMoves);

    await expect(
      service.execute('Forgetful Frank', 'Didn’t come prepared'),
    ).rejects.toThrow('Failed to generate character suggestion');
  });
});
