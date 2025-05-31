import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCharacterStatsService } from '../queries/generate-character-stats.service';
import { ChatGptService } from '../openai.service';
import { CharacterStats } from '../types/character.types';

describe('GenerateCharacterStatsService', () => {
  let service: GenerateCharacterStatsService;

  const validStats: CharacterStats = {
    strength: 6,
    agility: 3,
    intelligence: 2,
    charisma: 3,
    luck: 3,
    constitution: 3,
  };

  const mockChatGptService = {
    chatGptRequest: jest.fn().mockResolvedValue(validStats),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCharacterStatsService,
        {
          provide: ChatGptService,
          useValue: mockChatGptService,
        },
      ],
    }).compile();

    service = module.get(GenerateCharacterStatsService);
  });

  it('should generate valid stats with a total of 20 and min 1 per stat', async () => {
    const result = await service.execute(
      'Groovy Gravy',
      'A gravy-flinging menace',
    );

    expect(result).toEqual(validStats);
    expect(Object.values(result).reduce((acc, val) => acc + val, 0)).toBe(20);
    expect(Object.values(result).every((val) => val >= 1)).toBe(true);
    expect(mockChatGptService.chatGptRequest).toHaveBeenCalledTimes(1);
  });

  it('should throw if the total is not 20', async () => {
    mockChatGptService.chatGptRequest.mockResolvedValueOnce({
      ...validStats,
      charisma: 0, // breaks the rules
    });

    await expect(
      service.execute('Bad Stat Guy', 'Cheated the system'),
    ).rejects.toThrow('Failed to generate character stats');
  });
});
