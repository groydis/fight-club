// src/openai/openai.module.ts
import { Module } from '@nestjs/common';
import { ChatGptService } from './openai.service';
import { GenerateCharacterSuggestionsService } from './queries/generate-character-suggestions.service';
import { GenerateEnrichCharacterService } from './queries/generate-character-enrichment.service';

@Module({
  providers: [
    ChatGptService,
    GenerateCharacterSuggestionsService,
    GenerateEnrichCharacterService,
  ],
  exports: [
    GenerateCharacterSuggestionsService,
    GenerateEnrichCharacterService,
  ],
})
export class OpenAiModule {}
