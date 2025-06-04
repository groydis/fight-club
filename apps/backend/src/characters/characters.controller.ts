import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../common/types/extended-request';
import { AuthGuard } from '../auth/auth.guard';
import { Character } from '../common/types/character.types';
import { ListCharactersService } from './services/list-characters.service';

@UseGuards(AuthGuard)
@Controller('api/characters')
export class CharactersController {
  constructor(private readonly listCharactersService: ListCharactersService) {}

  @Get()
  getCharacters(@Req() req: AuthenticatedRequest): Promise<Character[]> {
    const userId = req.user?.local?.id;
    if (!userId) {
      throw new BadRequestException('Missing user information');
    }
    return this.listCharactersService.execute(userId);
  }
}
