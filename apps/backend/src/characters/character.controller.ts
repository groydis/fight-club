import { Body, Controller, Post } from '@nestjs/common';
import { CharactersService } from './character.service';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';

@Controller('api/characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('suggestion')
  suggestCharacter(@Body() dto: SuggestCharacterStatsDto) {
    return this.charactersService.suggestCharacter(dto);
  }
}
