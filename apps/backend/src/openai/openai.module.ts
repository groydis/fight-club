import { Module } from '@nestjs/common';
import { ChatGptService } from './openai.service';
import { GenerateCharacterStatsService } from './queries/generate-character-stats.service';

@Module({
  providers: [ChatGptService, GenerateCharacterStatsService],
  exports: [GenerateCharacterStatsService],
})
export class OpenAiModule {}
