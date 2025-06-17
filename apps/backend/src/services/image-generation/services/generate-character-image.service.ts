// src/character-image/generate-character-image.service.ts

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { LeonardoService } from '../../../services/leonoardo/leonardo.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { CharacterImageGenerator } from '../interface/character-image-generator.interface';
import { firstValueFrom } from 'rxjs';
import {
  ImageGenerationHints,
  VisualDescription,
} from '../../../common/types/character.types';
import { SharpBackgroundService } from '../../../services/sharp/services/sharp-background.service';
import { SHARP_BACKGROUND } from '../../../common/tokens';

enum ImagePromptType {
  FRONT = 'FRONT',
  PROFILE = 'PROFILE',
}

@Injectable()
export class GenerateCharacterImage implements CharacterImageGenerator {
  constructor(
    private readonly leo: LeonardoService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    @Inject(SHARP_BACKGROUND)
    private readonly sharpBackground: SharpBackgroundService,
  ) {}

  async execute(input: {
    characterId: string;
    visualDescription: VisualDescription;
    imageGenerationHints: ImageGenerationHints;
  }): Promise<{ front: Buffer; profile: Buffer }> {
    const { characterId, visualDescription, imageGenerationHints } = input;

    console.log({ visualDescription });
    console.log({ imageGenerationHints });

    const frontPromptText = this.buildLeonardoPromptFromVisualObject(
      visualDescription,
      imageGenerationHints,
      ImagePromptType.FRONT,
    );

    const profilePromptText = this.buildLeonardoPromptFromVisualObject(
      visualDescription,
      imageGenerationHints,
      ImagePromptType.PROFILE,
    );

    const [frontRecord, profileRecord] = await Promise.all([
      this.prisma.imagePrompt.create({
        data: {
          characterId,
          type: ImagePromptType.FRONT,
          promptText: frontPromptText,
        },
      }),
      this.prisma.imagePrompt.create({
        data: {
          characterId,
          type: ImagePromptType.PROFILE,
          promptText: profilePromptText,
        },
      }),
    ]);

    const results: { front?: Buffer; profile?: Buffer } = {};

    await Promise.all([
      this.generateAndTrack(
        frontPromptText,
        frontRecord.id,
        results,
        'front',
        imageGenerationHints,
      ),
      this.generateAndTrack(
        profilePromptText,
        profileRecord.id,
        results,
        'profile',
        imageGenerationHints,
      ),
    ]);

    return {
      front: results.front!,
      profile: results.profile!,
    };
  }

  private buildLeonardoPromptFromVisualObject(
    visual: VisualDescription,
    hints: ImageGenerationHints,
    type: 'FRONT' | 'PROFILE',
  ): string {
    const symbols =
      visual.visualSymbols.length > 0
        ? `Notable details include: ${visual.visualSymbols.join(', ')}.`
        : '';

    const baseDescription = `
A character with the following features:
- Facial Features: ${visual.facialFeatures}
- Body Type: ${visual.bodyType}
- Outfit: ${visual.outfit}
- Species: ${visual.species}
- Gender Presentation: ${visual.genderPresentation}
- Personality Vibe: ${visual.personalityVibe}
- Color Palette: ${visual.colorPalette}
${symbols}
`.trim();

    const extraPoseHint =
      type === 'FRONT'
        ? hints.recommendedImagePromptOverrides?.frontPoseHint
        : hints.recommendedImagePromptOverrides?.profilePoseHint;

    if (type === 'FRONT') {
      return `
        Front-facing, head-and-shoulders portrait of a stylized humanoid or creature.
        Only upper body and face should be shown.
        ${baseDescription}
        ${extraPoseHint ? `Pose Hint: ${extraPoseHint}` : ''}
        Style: semi-realistic, gritty, dramatic lighting.
        No text, logos, or weapons. Background should be neutral or blurred.
        `.trim();
    }

    if (type === 'PROFILE') {
      return `
        Side-facing, full-body pixel art sprite of a fighter character.
        The character should be shown from head to toe, facing to the right.
        Stance should be in an action-ready stance typical of arcade fighting characters.
        The background must be fully #FF00FF — only use the solid colour #FF00FF for the background.
        ${baseDescription}
        ${extraPoseHint ? `Pose Hint: ${extraPoseHint}` : ''}
        Adapt the stance and anatomy to suit their species. Use a limited color palette, strong silhouettes.
        No text, no logos, no scenery, no special effects.
        `.trim();
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unhandled image type: ${type}`);
  }

  private async generateAndTrack(
    promptText: string,
    promptId: string,
    results: Record<string, Buffer>,
    label: 'front' | 'profile',
    hints: ImageGenerationHints,
  ) {
    try {
      const generationId = await this.leo.generateImage({
        prompt: promptText,
        negative_prompt: hints.negativePrompt || '',
        modelId: 'de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3',
        styleId:
          label === 'profile'
            ? '645e4195-f63d-4715-a3f2-3fb1e6eb8c70' // Illustration
            : '8e2bc543-6ee2-45f9-bcd9-594b6ce84dcd', // Portrait
        width: 512,
        height: 512,
        num_images: 1,
      });

      const urls = await this.leo.waitForCompletion(generationId);

      if (!urls.length) {
        throw new Error('Leonardo returned no URLs (unexpected)');
      }

      const imageUrl = urls[0];

      const response$ = this.httpService.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const axiosResponse = await firstValueFrom(response$);
      const rawBuffer = Buffer.from(axiosResponse.data);

      // Optional: only apply for profile images or certain models
      const processedBuffer =
        label === 'profile'
          ? await this.sharpBackground.removeEdgeBackground(rawBuffer) // Or whatever background color you used
          : rawBuffer;

      results[label] = processedBuffer;
      await this.prisma.imagePrompt.update({
        where: { id: promptId },
        data: { success: true },
      });
    } catch (err) {
      console.error(`Leonardo image generation failed for ${label}:`, err);
      await this.prisma.imagePrompt.update({
        where: { id: promptId },
        data: {
          success: false,
          errorMessage: err instanceof Error ? err.message : 'Unknown Error',
        },
      });
    }
  }
}
