import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { Character } from '../../common/types/character.types';
import { toCharacterDto } from '../../character/mappers/character.mapper';

@Injectable()
export class GetCharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(characterId: string): Promise<Character> {
    const character = await this.prisma.character.findFirstOrThrow({
      where: { id: characterId, archived: false },
      include: {
        moves: true,
        user: true,
      },
    });
    return toCharacterDto(character);
  }
}
