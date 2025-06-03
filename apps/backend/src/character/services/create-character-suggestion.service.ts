import { Injectable } from '@nestjs/common';
import { GenerateCharacterSuggestionsService } from '../../services/openai/queries/generate-character-suggestions.service';
import { CreateCharacterSuggestionRequestDto } from '../dto/create-chracter-suggestion.request.dto';
import { CharacterSuggestion } from '../../common/types/character.types';

@Injectable()
export class CreateCharacterSuggestionService {
  constructor(
    private readonly characterSuggestions: GenerateCharacterSuggestionsService,
  ) {}
  async execute(
    dto: CreateCharacterSuggestionRequestDto,
  ): Promise<CharacterSuggestion> {
    return this.characterSuggestions.execute(dto.name, dto.description);
  }
}
