import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { OpenAIService } from '../../openai/openai.service';
import { generateCharacterPrompt } from '../prompts/generate-character-enrichment.prompt';
import {
  BaseCharacterInput,
  CharacterEnrichmentResult,
} from '../../../common/types/character.types';

type EnrichedMove = {
  name: string;
  description: string;
  effectValue: number;
};

function isValidEnrichedMove(m: unknown): m is EnrichedMove {
  if (typeof m !== 'object' || m === null) return false;

  const maybe = m as {
    name?: unknown;
    description?: unknown;
    effectValue?: unknown;
  };

  return (
    typeof maybe.name === 'string' &&
    maybe.name.trim().length > 0 &&
    typeof maybe.description === 'string' &&
    maybe.description.trim().length > 0 &&
    typeof maybe.effectValue === 'number' &&
    maybe.effectValue >= 10 &&
    maybe.effectValue <= 100
  );
}

@Injectable()
export class CharacterGenerateEnrichmentService {
  constructor(private readonly openAIService: OpenAIService) {}

  async execute(input: BaseCharacterInput): Promise<CharacterEnrichmentResult> {
    const { name, description, stats, basicMoves, specialMoves } = input;
    const prompt = generateCharacterPrompt(
      name,
      description,
      stats,
      basicMoves,
      specialMoves,
    );

    try {
      const result =
        await this.openAIService.chatGptRequest<CharacterEnrichmentResult>(
          prompt,
          [],
        );

      // ✅ Validate required shape
      if (
        !result.lore ||
        !Array.isArray(result.basicMoves) ||
        !Array.isArray(result.specialMoves)
      ) {
        throw new Error('Malformed enrichment response');
      }

      const allMovesValid =
        result.basicMoves.every(isValidEnrichedMove) &&
        result.specialMoves.every(isValidEnrichedMove);

      if (!allMovesValid) {
        throw new Error('One or more moves are invalid');
      }

      return result;
    } catch (err) {
      console.error('Character enrichment failed:', err);
      throw new ServiceUnavailableException(
        'Failed to enrich character data using OpenAI',
      );
    }
  }
}
