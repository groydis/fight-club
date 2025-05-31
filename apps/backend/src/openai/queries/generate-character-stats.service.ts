import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ChatGptService } from '../openai.service';
import { CharacterStats } from '../types/character.types';
import { generateCharacterStatsPrompt } from '../prompts/generate-character-stats.prompt';

@Injectable()
export class GenerateCharacterStatsService {
  constructor(private readonly chatGpt: ChatGptService) {}

  async execute(name: string, description: string): Promise<CharacterStats> {
    const prompt = generateCharacterStatsPrompt(name, description);

    try {
      const result = await this.chatGpt.chatGptRequest<CharacterStats>(
        prompt,
        [],
      );

      const total = Object.values(result).reduce((acc, val) => acc + val, 0);
      const hasMinOne = Object.values(result).every((val) => val >= 1);

      if (total !== 20 || !hasMinOne) {
        throw new Error(
          `Invalid stat distribution from OpenAI: ${JSON.stringify(result)}`,
        );
      }

      return result;
    } catch (err) {
      console.error('Stat generation failed:', err);
      throw new ServiceUnavailableException(
        'Failed to generate character stats',
      );
    }
  }
}
