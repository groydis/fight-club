import { Injectable } from '@nestjs/common';
import { CharacterImageGenerator } from './character-image-generator.interface';
import { ChatGptService } from '../../openai.service';
import { generateCharacterImagePromptBack } from '../../prompts/generate-character-image-back.prompt';
import { generateCharacterImagePromptFront } from '../../prompts/generate-character-image-front.prompt';
import { generateCharacterImagePromptProfile } from '../../prompts/generate-character-image-profile.prompt';

@Injectable()
export class GenerateCharacterImage implements CharacterImageGenerator {
  constructor(private readonly openai: ChatGptService) {}

  async execute(input: {
    name: string;
    description: string;
    lore: string;
    stats: Record<string, number>;
  }): Promise<{ front: Buffer; back: Buffer; profile: Buffer }> {
    const { name, description, lore, stats } = input;

    const frontPrompt = generateCharacterImagePromptFront(
      name,
      description,
      lore,
      stats,
    );
    const backPrompt = generateCharacterImagePromptBack(
      name,
      description,
      lore,
      stats,
    );
    const profilePrompt = generateCharacterImagePromptProfile(
      name,
      description,
      lore,
      stats,
    );

    console.log('Generating character images with prompts:');
    console.log('Front Prompt: ', frontPrompt);
    console.log('Back Prompt: ', backPrompt);
    console.log('Profile Prompt: ', profilePrompt);

    const [front, back, profile] = await Promise.all([
      this.openai.generateImageBase64(frontPrompt),
      this.openai.generateImageBase64(backPrompt),
      this.openai.generateImageBase64(profilePrompt),
    ]);

    return { front, back, profile };
  }
}
