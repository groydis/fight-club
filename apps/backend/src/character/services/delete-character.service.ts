// src/character/services/delete-character.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class DeleteCharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, characterId: string): Promise<void> {
    const character = await this.prisma.character.findFirst({
      where: {
        id: characterId,
        userId,
        archived: false,
      },
    });

    if (!character) {
      throw new NotFoundException('Character not found or already archived');
    }

    await this.prisma.character.update({
      where: { id: characterId },
      data: {
        archived: true,
      },
    });
  }
}
