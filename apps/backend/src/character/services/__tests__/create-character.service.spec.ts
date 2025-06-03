import { Test, TestingModule } from '@nestjs/testing';
import { mockEnriched } from '../../../test-utils/mock-character.data';
import { CreateCharacterService } from '../create-character.service';
import { STATIC_USERS } from '../../../test-utils/static.users';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { GenerateEnrichCharacterService } from '../../../services/openai/queries/generate-character-enrichment.service';
import {
  CHARACTER_IMAGE_GENERATOR,
  FILE_STORAGE,
} from '../../../common/tokens';
import {
  mockFileStorage,
  mockImageGenerator,
} from '../../../test-utils/mock-services';
import { createDto } from '../../../test-utils/mock-dtos';
import { CharacterStatus, MoveType } from '@prisma/client';

describe('CreateCharacterService', () => {
  let service: CreateCharacterService;

  const mockEnrichService = {
    execute: jest.fn().mockResolvedValue(mockEnriched),
  };

  const staticUserId = STATIC_USERS.activeUser1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCharacterService,
        PrismaService,
        {
          provide: GenerateEnrichCharacterService,
          useValue: mockEnrichService,
        },
        {
          provide: CHARACTER_IMAGE_GENERATOR,
          useValue: mockImageGenerator,
        },
        {
          provide: FILE_STORAGE,
          useValue: mockFileStorage,
        },
      ],
    }).compile();

    service = module.get(CreateCharacterService);
  });

  describe('execute', () => {
    afterEach(async () => {
      await service['prisma'].character.deleteMany({
        where: { userId: staticUserId },
      });
    });

    it('should create a new character with enriched data and persist to the DB', async () => {
      const result = await service.execute(createDto, staticUserId);

      // Wait for image generation mock to complete (simulate delay)
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(result).toMatchObject({
        name: createDto.name,
        description: createDto.description,
        userId: staticUserId,
        stats: createDto.stats,
        status: CharacterStatus.PROCESSING,
        lore: mockEnriched.lore,
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

      expect(result.moves).toHaveLength(4);

      expect(mockEnrichService.execute).toHaveBeenCalledWith(createDto);

      expect(mockImageGenerator.execute).toHaveBeenCalledWith({
        name: createDto.name,
        description: createDto.description,
        lore: mockEnriched.lore,
        stats: createDto.stats,
      });

      expect(mockFileStorage.upload).toHaveBeenCalledTimes(3);

      const persisted = await service['prisma'].character.findUnique({
        where: { id: result.id },
      });
      expect(persisted?.userId).toBe(staticUserId);
    });
  });
});
