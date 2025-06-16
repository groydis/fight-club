import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { OpenAIService } from '../../openai/openai.service';
import {
  CharacterAlignment,
  CharacterGender,
  CharacterSuggestion,
} from '../../../common/types/character.types';
import { generateCharacterSuggestionsPrompt } from '../prompts/generate-character-suggestions.prompt';

@Injectable()
export class CharacterGenerateSuggestionsService {
  constructor(private readonly openAIService: OpenAIService) {}

  async execute(
    name: string,
    description: string,
    gender: CharacterGender,
    species: string,
    alignment: CharacterAlignment,
  ): Promise<CharacterSuggestion> {
    const prompt = generateCharacterSuggestionsPrompt(
      name,
      description,
      gender,
      species,
      alignment,
    );

    try {
      const result =
        await this.openAIService.chatGptRequest<CharacterSuggestion>(
          prompt,
          [],
        );

      // Validate stats
      const stats = result.stats;
      const total = Object.values(stats).reduce((acc, val) => acc + val, 0);
      const allStatsMinOne = Object.values(stats).every((val) => val >= 1);

      if (total !== 30 || !allStatsMinOne) {
        throw new Error(`Invalid stat distribution: ${JSON.stringify(stats)}`);
      }

      // Validate move count
      if (result.basicMoves.length !== 6 || result.specialMoves.length !== 6) {
        throw new Error(`Invalid number of moves: ${JSON.stringify(result)}`);
      }

      return result;
    } catch (err) {
      console.error('Character suggestion generation failed:', err);
      throw new ServiceUnavailableException(
        'Failed to generate character suggestion',
      );
    }
  }
}
