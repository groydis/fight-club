import { Body, Controller, Post } from '@nestjs/common';
import { CharactersService } from './character.service';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';

@Controller('api/characters/stats')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('suggestions')
  suggestStats(@Body() dto: SuggestCharacterStatsDto) {
    return this.charactersService.suggestStats(dto);
  }
}
