// src/character-image/generate-character-image.service.ts

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LeonardoService } from '../../../services/leonoardo/leonardo.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { CharacterImageGenerator } from '../interface/character-image-generator.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GenerateCharacterImage implements CharacterImageGenerator {
  constructor(
    private readonly leo: LeonardoService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: {
    characterId: string;
    frontPrompt: string;
    profilePrompt: string;
  }): Promise<{ front: Buffer; profile: Buffer }> {
    const { characterId, frontPrompt, profilePrompt } = input;

    // TODO: make this one request - eg make a profile picture, now get this chaacter and put them in a fight pose
    // 1) Create two entries in imagePrompt (one for FRONT, one for PROFILE)
    const [frontRecord, profileRecord] = await Promise.all([
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

    // 2) Prepare a place to store the resulting buffers
    const results: { front?: Buffer; profile?: Buffer } = {};

    // 3) Kick off both generations in parallel
    await Promise.all([
      this.generateAndTrack(frontPrompt, frontRecord.id, results, 'front'),
      this.generateAndTrack(
        profilePrompt,
        profileRecord.id,
        results,
        'profile',
      ),
    ]);

    return {
      front: results.front!,
      profile: results.profile!,
    };
  }

  private async generateAndTrack(
    promptText: string,
    promptId: string,
    results: Record<string, Buffer>,
    label: 'front' | 'profile',
  ) {
    try {
      // ────────── A) Kick off a Leonardo.ai generation ───────────
      const generationId = await this.leo.generateImage({
        prompt: promptText,
        modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
        width: 512,
        height: 512,
        num_images: 1,
        // optional: negative_prompt, guidance_scale, etc.
      });

      // ────────── B) Wait until Leonardo returns a URL ───────────
      // This will poll every few seconds until status===COMPLETE
      const urls = await this.leo.waitForCompletion(generationId);

      if (!urls.length) {
        throw new Error('Leonardo returned no URLs (unexpected)');
      }

      // We only requested `num_images: 1`, so grab the first URL
      const imageUrl = urls[0];

      // ────────── C) Fetch raw bytes from the URL ───────────
      // Use HttpService to GET image as arraybuffer → Buffer
      const response$ = this.httpService.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const axiosResponse = await firstValueFrom(response$);
      const buffer = Buffer.from(axiosResponse.data);

      // ────────── D) Record success in your DB and stash the buffer ───────────
      results[label] = buffer;
      await this.prisma.imagePrompt.update({
        where: { id: promptId },
        data: { success: true },
      });
    } catch (err) {
      console.error(`Leonardo image generation failed for ${label}:`, err);
      // ────────── E) Mark failure in your DB ───────────
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
