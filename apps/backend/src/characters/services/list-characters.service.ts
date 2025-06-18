import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { Character } from '../../common/types/character.types';
import { toCharacterDto } from '../../character/mappers/character.mapper';

@Injectable()
export class ListCharactersService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<Character[]> {
    const characters = await this.prisma.character.findMany({
      where: { userId, archived: false },
      include: {
        moves: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return characters.map(toCharacterDto);
  }
}
