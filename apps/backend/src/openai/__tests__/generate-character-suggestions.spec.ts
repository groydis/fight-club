import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCharacterSuggestionsService } from '../queries/generate-character-suggestions.service';
import { ChatGptService } from '../openai.service';
import { CharacterSuggestion } from '../types/character.types';
import { ServiceUnavailableException } from '@nestjs/common';

describe('GenerateCharacterSuggestionsService', () => {
  let service: GenerateCharacterSuggestionsService;

  const validSuggestion: CharacterSuggestion = {
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
      { name: 'Salt Toss', primaryStat: 'agility' },
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
    expect(Object.values(result.stats).reduce((a, b) => a + b)).toBe(30);
    expect(result.basicMoves).toHaveLength(6);
    expect(result.specialMoves).toHaveLength(6);
    expect(result.basicMoves.every((move) => move.primaryStat)).toBe(true);
    expect(result.specialMoves.every((move) => move.primaryStat)).toBe(true);
  });

  it('should throw if stat total is not 30', async () => {
    const brokenStats: CharacterSuggestion = {
      ...validSuggestion,
      stats: {
        ...validSuggestion.stats,
        strength: 10,
        luck: 9,
      },
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(brokenStats);

    await expect(
      service.execute('Overpowered Chad', 'Stat cheater'),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('should throw if there are not exactly 5 moves of each type', async () => {
    const brokenMoves: CharacterSuggestion = {
      ...validSuggestion,
      basicMoves: validSuggestion.basicMoves.slice(0, 3),
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(brokenMoves);

    await expect(
      service.execute('Forgetful Frank', 'Didn’t come prepared'),
    ).rejects.toThrow('Failed to generate character suggestion');
  });

  it('should throw if any move is missing a primaryStat', async () => {
    const invalidMoves: CharacterSuggestion = {
      ...validSuggestion,
      specialMoves: [
        ...validSuggestion.specialMoves.slice(0, 4),
        {
          name: 'Broken Move',
        } as unknown as (typeof validSuggestion.specialMoves)[number],
      ],
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(invalidMoves);

    await expect(
      service.execute('Stateless Steve', 'Forgot how to fight'),
    ).rejects.toThrow('Failed to generate character suggestion');
  });
});
