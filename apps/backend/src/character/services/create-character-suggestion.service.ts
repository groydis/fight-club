import { Injectable } from '@nestjs/common';
import { CreateCharacterSuggestionRequestDto } from '../dto/create-chracter-suggestion.request.dto';
import { CharacterSuggestion } from '../../common/types/character.types';
import { CharacterGenerateSuggestionsService } from '../../services/character-generation/services/character-generate-suggestions.service';

@Injectable()
export class CreateCharacterSuggestionService {
  constructor(
    private readonly characterSuggestions: CharacterGenerateSuggestionsService,
  ) {}
  async execute(
    dto: CreateCharacterSuggestionRequestDto,
  ): Promise<CharacterSuggestion> {
    return this.characterSuggestions.execute(dto.name, dto.description);
  }
}
