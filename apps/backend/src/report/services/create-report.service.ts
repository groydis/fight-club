// src/report/create-report.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateCharacterReportDto } from '../dto/create-character-report.dto';
import { CharacterReportReason } from '@prisma/client';

@Injectable()
export class CreateReportService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateCharacterReportDto, userId: string): Promise<void> {
    const character = await this.prisma.character.findUnique({
      where: { id: dto.characterId },
      select: { id: true },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    await this.prisma.characterReport.create({
      data: {
        characterId: dto.characterId,
        reason: dto.reason as CharacterReportReason,
        detail: dto.detail,
        userId: userId,
      },
    });
  }
}
