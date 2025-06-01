import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CharactersService } from './character.service';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('api/characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('suggestion')
  suggestCharacter(@Body() dto: SuggestCharacterStatsDto) {
    return this.charactersService.suggestCharacter(dto);
  }

  @Post()
  create(@Body() dto: CreateCharacterDto) {
    const total = (Object.values(dto.stats) as number[]).reduce(
      (sum, val) => sum + val,
      0,
    );

    if (total !== 30) {
      throw new BadRequestException('Total stat points must equal 30');
    }

    return this.charactersService.createCharacter(dto);
  }
}
