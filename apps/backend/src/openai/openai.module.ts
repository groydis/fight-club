// src/openai/openai.module.ts
import { Module } from '@nestjs/common';
import { ChatGptService } from './openai.service';
import { GenerateCharacterStatsService } from './queries/generate-character-stats.service';
import { GenerateCharacterSuggestionsService } from './queries/generate-character-suggestions.service';

@Module({
  providers: [
    ChatGptService,
    GenerateCharacterStatsService,
    GenerateCharacterSuggestionsService,
  ],
  exports: [GenerateCharacterStatsService, GenerateCharacterSuggestionsService],
})
export class OpenAiModule {}
