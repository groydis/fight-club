import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from '../character.controller';
import { CharactersService } from '../character.service';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { GenerateEnrichCharacterService } from '../../openai/queries/generate-character-enrichment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SuggestCharacterStatsDto } from '../dto/suggest-character-stats.dto';
import {
  CharacterMoveDto,
  CreateCharacterDto,
} from '../dto/create-character.dto';
import { CharacterStatus, MoveType } from '@prisma/client';
import { MockCharacterImageGenerator } from '../../openai/queries/image-generation/mock-character-image-generator.service';
import { MockFileStorage } from '../../common/storage/mock-file-storage.service';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../../common/tokens';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;
  const mockSuggestion = {
    stats: {
      strength: 6,
      agility: 6,
      intelligence: 5,
      charisma: 4,
      luck: 5,
      constitution: 4,
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

  const mockEnriched = {
    lore: 'Forged in the depths of a forgotten soup kitchen.',
    basicMoves: [
      {
        name: 'Soup Slap',
        description: 'Hits hard with broth-laced power.',
        effectValue: 20,
      },
      {
        name: 'Breadstick Jab',
        description: 'Fast and crunchy.',
        effectValue: 15,
      },
      {
        name: 'Crouton Kick',
        description: 'Dry and devastating.',
        effectValue: 18,
      },
      {
        name: 'Boil Punch',
        description: 'Steamy knuckles.',
        effectValue: 17,
      },
      {
        name: 'Salt Fling',
        description: 'Eyes beware.',
        effectValue: 10,
      },
      {
        name: 'Salt Toss',
        description: 'Petty and painful.',
        effectValue: 11,
      },
    ],
    specialMoves: [
      {
        name: 'Boil Over',
        description: 'Unleashes molten gravy.',
        effectValue: 40,
      },
      {
        name: 'Ladle of Justice',
        description: 'Serves it hot.',
        effectValue: 38,
      },
      {
        name: 'Steam Surge',
        description: 'Clouds of pain.',
        effectValue: 35,
      },
      {
        name: 'Molten Splash',
        description: 'Burning embrace.',
        effectValue: 36,
      },
      {
        name: 'Final Simmer',
        description: 'Last breath of broth.',
        effectValue: 45,
      },
      {
        name: 'Salty Smile',
        description: 'Hurts your feelings.',
        effectValue: 42,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        CharactersService,
        PrismaService,
        {
          provide: GenerateCharacterSuggestionsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockSuggestion),
          },
        },
        {
          provide: GenerateEnrichCharacterService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockEnriched),
          },
        },
        {
          provide: CHARACTER_IMAGE_GENERATOR,
          useClass: MockCharacterImageGenerator,
        },
        {
          provide: FILE_STORAGE,
          useClass: MockFileStorage,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  describe('suggestCharacter', () => {
    it('returns a valid suggestion object from the controller', async () => {
      const dto: SuggestCharacterStatsDto = {
        name: 'Groovy Gravy',
        description: 'Heavily seasoned, lightly unhinged.',
      };

      const result = await controller.suggestCharacter(dto);

      expect(result.stats).toEqual(mockSuggestion.stats);
      expect(result.basicMoves).toHaveLength(6);
      expect(result.specialMoves).toHaveLength(6);
    });
  });

  describe('createCharacter', () => {
    const dto: CreateCharacterDto = {
      name: 'Groovy Gravy',
      description: 'Heavily seasoned, lightly unhinged.',
      stats: mockSuggestion.stats,
      basicMoves: mockSuggestion.basicMoves.map(
        (m): CharacterMoveDto => ({
          name: m.name,
          primaryStat: m.primaryStat as CharacterMoveDto['primaryStat'],
        }),
      ),
      specialMoves: mockSuggestion.specialMoves.map(
        (m): CharacterMoveDto => ({
          name: m.name,
          primaryStat: m.primaryStat as CharacterMoveDto['primaryStat'],
        }),
      ),
    };

    it('persists a new character and returns the DTO', async () => {
      const result = await controller.create(dto);

      expect(result).toMatchObject({
        name: dto.name,
        description: dto.description,
        lore: mockEnriched.lore,
        status: CharacterStatus.PROCESSING,
        stats: dto.stats,
      });

      expect(result.moves).toHaveLength(12);
      expect(result.moves).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Soup Slap',
            type: MoveType.BASIC,
            effectValue: 20,
          }),
          expect.objectContaining({
            name: 'Boil Over',
            type: MoveType.SPECIAL,
            effectValue: 40,
          }),
        ]),
      );

      // DB cleanup
      await service['prisma'].character.delete({ where: { id: result.id } });
    });
  });
});
