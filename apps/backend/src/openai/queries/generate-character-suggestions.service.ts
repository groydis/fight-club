import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ChatGptService } from '../openai.service';
import { CharacterSuggestion } from '../../common/types/character.types';
import { generateCharacterSuggestionsPrompt } from '../prompts/generate-character-suggestions.prompt';

@Injectable()
export class GenerateCharacterSuggestionsService {
  constructor(private readonly chatGpt: ChatGptService) {}

  async execute(
    name: string,
    description: string,
  ): Promise<CharacterSuggestion> {
    const prompt = generateCharacterSuggestionsPrompt(name, description);

    try {
      const result = await this.chatGpt.chatGptRequest<CharacterSuggestion>(
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
