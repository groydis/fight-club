import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { Character } from '../../common/types/character.types';
import { toCharacterDto } from '../../character/mappers/character.mapper';
import { PaginatedResult } from '../../common/types/pagination.types';

@Injectable()
export class ListCharactersService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(options: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt';
    order?: 'asc' | 'desc';
    userId?: string;
  }): Promise<PaginatedResult<Character>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      userId,
    } = options;

    const offset = (page - 1) * limit;

    const whereClause: any = {
      archived: false,
      ...(userId && { userId }),
    };

    const [totalCount, characters] = await this.prisma.$transaction([
      this.prisma.character.count({ where: whereClause }),
      this.prisma.character.findMany({
        where: whereClause,
        include: {
          moves: true,
          user: true,
        },
        orderBy: { [sortBy]: order },
        skip: offset,
        take: limit,
      }),
    ]);

    return {
      items: characters.map(toCharacterDto),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
