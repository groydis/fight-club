import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../character.controller';
import { CharactersService } from '../character.service';

describe('CharactersController', () => {
  let controller: CharactersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [CharactersService],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
  });

  it('should return mock suggestions', () => {
    const result = controller.suggestStats({
      name: 'Groovy Gravy',
      description: 'Heavily seasoned, lightly unhinged.',
    });

    expect(result).toHaveProperty('stats');
    expect(result).toHaveProperty('moves');
    expect(result.moves.length).toBeGreaterThan(0);
  });
});
