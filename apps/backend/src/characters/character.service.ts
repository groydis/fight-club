import { Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { GenerateCharacterSuggestionsService } from '../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../openai/types/character.types';

@Injectable()
export class CharactersService {
  constructor(
    private readonly characterSuggestions: GenerateCharacterSuggestionsService,
  ) {}

  async suggestCharacter(
    dto: SuggestCharacterStatsDto,
  ): Promise<CharacterSuggestion> {
    return this.characterSuggestions.execute(dto.name, dto.description);
  }
}
