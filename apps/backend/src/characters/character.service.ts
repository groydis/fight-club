import { Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { GenerateCharacterSuggestionsService } from '../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../openai/types/character.types';
import { CreateCharacterDto } from './dto/create-character.dto';
import { GenerateEnrichCharacterService } from '../openai/queries/generate-character-enrichment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterStatus, MoveType, Prisma } from '@prisma/client';
import { toCharacterDto } from './mappers/character.mapper';
import { CharacterDto } from './dto/character.dto';

@Injectable()
export class CharactersService {
  constructor(
    private readonly characterSuggestions: GenerateCharacterSuggestionsService,
    private readonly prisma: PrismaService, // Todo: create prisma service in nuxt
    private readonly enrichCharacter: GenerateEnrichCharacterService,
  ) {}

  async suggestCharacter(
    dto: SuggestCharacterStatsDto,
  ): Promise<CharacterSuggestion> {
    return this.characterSuggestions.execute(dto.name, dto.description);
  }

  async createCharacter(dto: CreateCharacterDto): Promise<CharacterDto> {
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
        lore: enrichment.lore,
        stats: stats as unknown as Prisma.InputJsonValue,
        status: CharacterStatus.PROCESSING,
        moves: {
          create: [
            ...basicMoves.map((move, i) => ({
              name: move.name,
              primaryStat: move.primaryStat,
              description: enrichment.basicMoves[i].description,
              effectValue: enrichment.basicMoves[i].effectValue,
              stat: move.primaryStat,
              type: MoveType.BASIC,
            })),
            ...specialMoves.map((move, i) => ({
              name: move.name,
              primaryStat: move.primaryStat,
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
    // void this.queueImageGeneration(character.id, name, description, stats);

    return toCharacterDto(character);
  }

  //   private async queueImageGeneration(
  //   characterId: string,
  //   name: string,
  //   description: string,
  //   stats: Record<string, number>,
  // ) {
  //   // Stub: Replace with message queue, background worker, or endpoint trigger
  //   console.log(`[ImageGen] Queuing image generation for ${name} (${characterId})`);
  // }
}
