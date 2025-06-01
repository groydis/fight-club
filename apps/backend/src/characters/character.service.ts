import { Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';
import { GenerateCharacterSuggestionsService } from '../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../openai/types/character.types';
import { CreateCharacterDto } from './dto/create-character.dto';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async createCharacter(dto: CreateCharacterDto): Promise<void> {
    return void 0; // Placeholder for actual character creation logic
  }
}
