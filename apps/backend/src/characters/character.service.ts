import { Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { GenerateCharacterStatsService } from '../openai/queries/generate-character-stats.service';
import { CharacterStats } from '../openai/types/character-stats.type';

@Injectable()
export class CharactersService {
  constructor(private readonly characterStats: GenerateCharacterStatsService) {}

  async suggestStats(dto: SuggestCharacterStatsDto): Promise<CharacterStats> {
    return this.characterStats.execute(dto.name, dto.description);
  }
}
