import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../character.controller';
import { CharactersService } from '../character.service';
import { GenerateCharacterStatsService } from '../../openai/queries/generate-character-stats.service';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';
import { CharacterStats } from '../../openai/types/character-stats.type';

describe('CharactersController', () => {
  let controller: CharactersController;

  const mockStats: CharacterStats = {
    strength: 6,
    agility: 4,
    intelligence: 3,
    charisma: 2,
    luck: 3,
    constitution: 2,
  };

  const mockStatsService = {
    execute: jest.fn().mockResolvedValue(mockStats),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        CharactersService,
        {
          provide: GenerateCharacterStatsService,
          useValue: mockStatsService,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
  });

  it('should return mocked character stats without calling OpenAI', async () => {
    const dto: SuggestCharacterStatsDto = {
      name: 'Groovy Gravy',
      description: 'Heavily seasoned, lightly unhinged.',
    };

    const result = await controller.suggestStats(dto);

    expect(result).toEqual(mockStats);
    expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(20);
    expect(Object.values(result).every((val) => val >= 1)).toBe(true);
    expect(mockStatsService.execute).toHaveBeenCalledWith(
      dto.name,
      dto.description,
    );
  });
});
