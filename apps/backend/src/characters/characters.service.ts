import { Inject, Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { GenerateCharacterSuggestionsService } from '../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../common/types/character.types';
import { CreateCharacterDto } from './dto/create-character.dto';
import { GenerateEnrichCharacterService } from '../openai/queries/generate-character-enrichment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterStatus, MoveType, Prisma } from '@prisma/client';
import { toCharacterDto } from './mappers/character.mapper';
import { CharacterDto } from './dto/character.dto';

import { CharacterImageGenerator } from '../openai/queries/image-generation/character-image-generator.interface';
import { FileStorage } from '../common/storage/file-storage.interface';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../common/tokens';
import { CharacterListItemDto } from './dto/character-list.dto';

@Injectable()
export class CharactersService {
  constructor(
    private readonly characterSuggestions: GenerateCharacterSuggestionsService,
    private readonly prisma: PrismaService, // Todo: create prisma service in nuxt
    private readonly enrichCharacter: GenerateEnrichCharacterService,
    @Inject(CHARACTER_IMAGE_GENERATOR)
    private readonly imageGenerator: CharacterImageGenerator,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
  ) {}

  async getCharactersForUser(userId: string): Promise<CharacterListItemDto[]> {
    return this.prisma.character.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        imageProfileUrl: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async suggestCharacter(
    dto: SuggestCharacterStatsDto,
  ): Promise<CharacterSuggestion> {
    return this.characterSuggestions.execute(dto.name, dto.description);
  }

  async createCharacter(
    dto: CreateCharacterDto,
    userId: string,
  ): Promise<CharacterDto> {
    const { name, description, stats, basicMoves, specialMoves } = dto;

    // 1️⃣ Enrich character with lore, move descriptions, and effect values
    const enrichment = await this.enrichCharacter.execute({
      name,
      description,
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
      },
    });

    // 3️⃣ Queue AI image generation (background job or event emitter)
    void this.queueImageGeneration(
      character.id,
      name,
      description,
      enrichment.lore,
      stats as unknown as Record<string, number>,
    );

    return toCharacterDto(character);
  }

  private async queueImageGeneration(
    characterId: string,
    name: string,
    description: string,
    lore: string,
    stats: Record<string, number>,
  ) {
    console.log(
      `[ImageGen] Queuing image generation for ${name} (${characterId})`,
    );

    try {
      const { front, back, profile } = await this.imageGenerator.execute({
        name,
        description,
        lore,
        stats,
      });

      const frontPath = `characters/${characterId}-front.png`;
      const backPath = `characters/${characterId}-back.png`;
      const profilePath = `characters/${characterId}-profile.png`;

      const [frontUrl, backUrl, profileUrl] = await Promise.all([
        this.fileStorage.upload(frontPath, front, 'image/png'),
        this.fileStorage.upload(backPath, back, 'image/png'),
        this.fileStorage.upload(profilePath, profile, 'image/png'),
      ]);

      await this.prisma.character.update({
        where: { id: characterId },
        data: {
          imageFrontUrl: frontUrl,
          imageBackUrl: backUrl,
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
