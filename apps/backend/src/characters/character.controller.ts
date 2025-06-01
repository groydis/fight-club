import { Body, Controller, Post } from '@nestjs/common';
import { CharactersService } from './character.service';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';

@Controller('api/characters')
// @UseGuards(AuthGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('suggestion')
  suggestCharacter(@Body() dto: SuggestCharacterStatsDto) {
    return this.charactersService.suggestCharacter(dto);
  }

  @Post()
  createCharacter(@Body() dto: SuggestCharacterStatsDto) {
    // Placeholder for character creation logic
    return this.charactersService.suggestCharacter(dto);
  }
}
