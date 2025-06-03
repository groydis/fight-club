import { Injectable } from '@nestjs/common';
import { CharacterImageGenerator } from './character-image-generator.interface';
import { ChatGptService } from '../../openai.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GenerateCharacterImage implements CharacterImageGenerator {
  constructor(
    private readonly openai: ChatGptService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: {
    characterId: string;
    frontPrompt: string;
    profilePrompt: string;
  }): Promise<{ front: Buffer; profile: Buffer }> {
    const { characterId, frontPrompt, profilePrompt } = input;

    // Create prompt records and store their IDs
    const [front, profile] = await Promise.all([
      this.prisma.imagePrompt.create({
        data: {
          characterId,
          type: 'FRONT',
          promptText: frontPrompt,
        },
      }),
      this.prisma.imagePrompt.create({
        data: {
          characterId,
          type: 'PROFILE',
          promptText: profilePrompt,
        },
      }),
    ]);

    const results: {
      front?: Buffer;
      profile?: Buffer;
    } = {};

    await Promise.all([
      this.generateAndTrack(frontPrompt, front.id, results, 'front'),
      this.generateAndTrack(profilePrompt, profile.id, results, 'profile'),
    ]);

    return {
      front: results.front!,
      profile: results.profile!,
    };
  }

  private async generateAndTrack(
    prompt: string,
    promptId: string,
    results: Record<string, Buffer>,
    label: string,
  ) {
    try {
      const image = await this.openai.generateImageBase64(prompt);
      results[label] = image;
      await this.prisma.imagePrompt.update({
        where: { id: promptId },
        data: {
          success: true,
        },
      });
    } catch (error) {
      console.error(`Image generation failed for ${label}:`, error);
      await this.prisma.imagePrompt.update({
        where: { id: promptId },
        data: {
          success: false,
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}
