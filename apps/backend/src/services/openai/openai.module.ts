// src/openai/openai.module.ts
import { Module } from '@nestjs/common';
import { ChatGptService } from './openai.service';
import { GenerateCharacterSuggestionsService } from './queries/generate-character-suggestions.service';
import { GenerateEnrichCharacterService } from './queries/generate-character-enrichment.service';
import { GenerateCharacterImage } from './queries/image-generation/generate-character-image-generator.service';
import { CHARACTER_IMAGE_GENERATOR } from '../../common/tokens';
import { MockCharacterImageGenerator } from './queries/image-generation/mock-character-image-generator.service';

const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

@Module({
  providers: [
    ChatGptService,
    GenerateCharacterSuggestionsService,
    GenerateEnrichCharacterService,
    {
      provide: CHARACTER_IMAGE_GENERATOR,
      useClass: useMockServices
        ? MockCharacterImageGenerator
        : GenerateCharacterImage,
    },
  ],
  exports: [
    GenerateCharacterSuggestionsService,
    GenerateEnrichCharacterService,
    CHARACTER_IMAGE_GENERATOR,
  ],
})
export class OpenAiModule {}
