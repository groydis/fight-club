import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../common/types/extended-request';
import { AuthGuard } from '../auth/auth.guard';
import { Character } from '../common/types/character.types';
import { ListCharactersService } from './services/list-characters.service';
import { PaginatedResult } from '../common/types/pagination.types';

@UseGuards(AuthGuard)
@Controller('api/characters')
export class CharactersController {
  constructor(private readonly listCharactersService: ListCharactersService) {}

  @Get()
  getCharacters(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: 'createdAt',
    @Query('order') order?: 'asc' | 'desc',
    @Query('username') userId?: string,
  ): Promise<PaginatedResult<Character>> {
    return this.listCharactersService.execute({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy,
      order,
      userId,
    });
  }
}
