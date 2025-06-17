import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from '../../../openai/openai.service';
import {
  BaseCharacterInput,
  CharacterAlignment,
  CharacterEnrichmentResult,
  CharacterGender,
} from '../../../../common/types/character.types';
import { ServiceUnavailableException } from '@nestjs/common';
import { CharacterGenerateEnrichmentService } from '../character-generate-enrichment.service';

describe('GenerateEnrichCharacterService', () => {
  let service: CharacterGenerateEnrichmentService;

  const baseInput: BaseCharacterInput = {
    name: 'Groovy Gravy',
    description: 'An oozing menace from the soup dimension.',
    gender: CharacterGender.Male,
    species: 'Human',
    alignment: CharacterAlignment.TrueNeutral,
    stats: {
      strength: 5,
      agility: 5,
      intelligence: 5,
      charisma: 5,
      luck: 5,
      constitution: 5,
    },
    basicMoves: [
      { name: 'Slop Swing', primaryStat: 'strength' },
      { name: 'Gravy Jab', primaryStat: 'agility' },
    ],
    specialMoves: [
      { name: 'Boil Burst', primaryStat: 'intelligence' },
      { name: 'Steam Roar', primaryStat: 'charisma' },
    ],
  };

  const validEnrichment: CharacterEnrichmentResult = {
    lore: 'Born in a bubbling cauldron of regret, Groovy Gravy fights to return flavor to a tasteless world.',
    visualDescription: {
      facialFeatures:
        'Sharp, angular jawline with high cheekbones and glowing yellow eyes. A jagged scar runs down the left side of the face, barely missing the eye. Eyebrows are thin and arched, giving a perpetually suspicious look.',
      bodyType:
        'Tall and lean with a wiry frame. Long limbs and clawed fingers. Posture is always tense, as if ready to spring into action.',
      personalityVibe:
        'Cunning and unpredictable, like a rogue who thrives in chaos. Gives off an unsettling, unblinking confidence.',
      outfit:
        'Dark, asymmetrical leather armor with reinforced shoulder plating. A hooded cloak frayed at the edges, and various pouches strapped to the waist.',
      colorPalette:
        'Muted greys, tarnished golds, and glowing amber highlights.',
      species: 'Voidborne Half-elf',
      genderPresentation:
        'Androgynous with a slight masculine lean, accentuated by angular features and a low voice.',
      visualSymbols: [
        'A broken compass hanging from a chain',
        'A glowing rune tattooed across the right forearm',
        'A torn faction insignia sewn onto the cloak',
      ],
    },
    imageGenerationHints: {
      characterType: 'chaotic void rogue',
      modelPreference: '6c95de60-a0bc-4f90-b637-ee8971caf3b0', // Leonardo "Character Portraits"
      negativePrompt:
        'no duck features, no cartoon eyes, no goofy hats, avoid neon colors, no exaggerated proportions',
      preferredStyleId: '8e2bc543-6ee2-45f9-bcd9-594b6ce84dcd', // Portrait
      recommendedImagePromptOverrides: {
        frontPoseHint:
          'smirking slightly with one hand half-raised in a conjuring gesture',
        profilePoseHint:
          'crouched in a ready stance, one hand hovering near a hidden blade',
      },
    },
    basicMoves: [
      {
        name: 'Slop Swing',
        description:
          'A wide, viscous strike that flings boiling gravy everywhere.',
        effectValue: 42,
      },
      {
        name: 'Gravy Jab',
        description:
          'A quick, slick jab that leaves foes both hurt and confused.',
        effectValue: 36,
      },
    ],
    specialMoves: [
      {
        name: 'Boil Burst',
        description: 'An explosive eruption of heat and spice.',
        effectValue: 77,
      },
      {
        name: 'Steam Roar',
        description: 'A terrifying screech of evaporating madness.',
        effectValue: 66,
      },
    ],
  };

  const mockChatGptService = {
    chatGptRequest: jest.fn().mockResolvedValue(validEnrichment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterGenerateEnrichmentService,
        {
          provide: OpenAIService,
          useValue: mockChatGptService,
        },
      ],
    }).compile();

    service = module.get(CharacterGenerateEnrichmentService);
  });

  it('should return enriched character data', async () => {
    const result = await service.execute(baseInput);

    expect(result.lore).toBe(validEnrichment.lore);
    expect(result.basicMoves).toHaveLength(2);
    expect(result.specialMoves).toHaveLength(2);
    expect(
      result.basicMoves.every((m) => !!m.description && !!m.effectValue),
    ).toBe(true);
    expect(
      result.specialMoves.every((m) => !!m.description && !!m.effectValue),
    ).toBe(true);
  });

  it('should throw if lore is missing', async () => {
    const broken: CharacterEnrichmentResult = {
      ...validEnrichment,
      lore: '',
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(broken);

    await expect(service.execute(baseInput)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw if a move has invalid effect value', async () => {
    const broken: CharacterEnrichmentResult = {
      ...validEnrichment,
      basicMoves: [
        { ...validEnrichment.basicMoves[0], effectValue: 999 },
        ...validEnrichment.basicMoves.slice(1),
      ],
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(broken);

    await expect(service.execute(baseInput)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw if any move is missing a description', async () => {
    const broken: CharacterEnrichmentResult = {
      ...validEnrichment,
      specialMoves: [
        ...validEnrichment.specialMoves.slice(0, 1),
        {
          name: 'Steam Roar',
          description: '',
          effectValue: 66,
        },
      ],
    };

    mockChatGptService.chatGptRequest.mockResolvedValueOnce(broken);

    await expect(service.execute(baseInput)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw if OpenAI call completely fails', async () => {
    mockChatGptService.chatGptRequest.mockRejectedValueOnce(
      new Error('openai go boom'),
    );

    await expect(service.execute(baseInput)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
