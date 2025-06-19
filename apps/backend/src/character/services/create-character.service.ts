import { Injectable, Inject } from '@nestjs/common';

import { FileStorage } from '../../services/storage/interfaces/file-storage.interface';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../../common/tokens';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateCharacterDto } from '../dto/create-character.request.dto';
import { toCharacterDto } from '../mappers/character.mapper';
import {
  Character,
  ImageGenerationHints,
  VisualDescription,
} from '../../common/types/character.types';
import { CharacterStatus, MoveType, Prisma } from '@prisma/client';
import { GenerateCharacterImage } from '../../services/image-generation/services/generate-character-image.service';
import { CharacterGenerateEnrichmentService } from '../../services/character-generation/services/character-generate-enrichment.service';

@Injectable()
export class CreateCharacterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrichCharacter: CharacterGenerateEnrichmentService,
    @Inject(CHARACTER_IMAGE_GENERATOR)
    private readonly generateCharacterImage: GenerateCharacterImage,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
  ) {}
  async execute(dto: CreateCharacterDto, userId: string): Promise<Character> {
    const {
      name,
      description,
      gender,
      species,
      alignment,
      stats,
      basicMoves,
      specialMoves,
    } = dto;

    // 1️⃣ Enrich character with lore, move descriptions, and effect values
    const enrichment = await this.enrichCharacter.execute({
      name,
      description,
      gender,
      species,
      alignment,
      stats,
      basicMoves,
      specialMoves,
    });

    // 2️⃣ Persist to DB
    const character = await this.prisma.character.create({
      data: {
        name,
        description,
        userId,
        lore: enrichment.lore,
        stats: stats as unknown as Prisma.InputJsonValue,
        status: CharacterStatus.PROCESSING, // Assuming userId is passed in CreateCharacterDto
        gender,
        species,
        alignment,
        moves: {
          create: [
            ...basicMoves.map((move, i) => ({
              name: move.name,
              description: enrichment.basicMoves[i].description,
              effectValue: enrichment.basicMoves[i].effectValue,
              stat: move.primaryStat,
              type: MoveType.BASIC,
            })),
            ...specialMoves.map((move, i) => ({
              name: move.name,
              description: enrichment.specialMoves[i].description,
              effectValue: enrichment.specialMoves[i].effectValue,
              stat: move.primaryStat,
              type: MoveType.SPECIAL,
            })),
          ],
        },
      },
      include: {
        moves: true,
        user: true,
      },
    });

    // 3️⃣ Queue AI image generation (background job or event emitter)
    void this.queueImageGeneration(
      userId,
      character.id,
      name,
      enrichment.visualDescription,
      enrichment.imageGenerationHints,
    );

    return toCharacterDto(character);
  }

  private async queueImageGeneration(
    userId: string,
    characterId: string,
    name: string,
    visualDescription: VisualDescription,
    imageGenerationHints: ImageGenerationHints,
  ) {
    console.log(
      `[ImageGen] Queuing image generation for ${name} (${characterId})`,
    );

    try {
      const { front, profile } = await this.generateCharacterImage.execute({
        characterId,
        visualDescription,
        imageGenerationHints,
      });

      const frontPath = `${userId}/characters/${characterId}/front.png`;
      const profilePath = `${userId}/characters/${characterId}/profile.png`;

      const [frontUrl, profileUrl] = await Promise.all([
        this.fileStorage.upload(frontPath, front, 'image/png'),
        this.fileStorage.upload(profilePath, profile, 'image/png'),
      ]);

      await this.prisma.character.update({
        where: { id: characterId },
        data: {
          imageFrontUrl: frontUrl,
          imageProfileUrl: profileUrl,
          status: CharacterStatus.READY,
        },
      });

      console.log(`[ImageGen] Uploaded images for ${name}`);
    } catch (err) {
      console.error(
        `[ImageGen] Failed to generate/upload images: ${String(err)}`,
      );
    }
  }
}
