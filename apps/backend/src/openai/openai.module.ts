// src/openai/openai.module.ts
import { Module } from '@nestjs/common';
import { ChatGptService } from './openai.service';
import { GenerateCharacterSuggestionsService } from './queries/generate-character-suggestions.service';

@Module({
  providers: [ChatGptService, GenerateCharacterSuggestionsService],
  exports: [GenerateCharacterSuggestionsService],
})
export class OpenAiModule {}
