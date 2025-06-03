import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Character } from '../../common/types/character.types';
import { toCharacterDto } from '../../character/mappers/character.mapper';

@Injectable()
export class GetCharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, characterId: string): Promise<Character> {
    const character = await this.prisma.character.findFirstOrThrow({
      where: { userId, id: characterId }, // We want to ensure the user owns the character (for now)
      include: {
        moves: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return toCharacterDto(character);
  }
}
