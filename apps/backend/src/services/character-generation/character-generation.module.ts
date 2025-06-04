// src/character-generation/character-generation.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

import { CharacterGenerateEnrichmentService } from './services/character-generate-enrichment.service';
import { CharacterGenerateSuggestionsService } from './services/character-generate-suggestions.service';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [HttpModule, PrismaModule, OpenAIModule],
  providers: [
    CharacterGenerateSuggestionsService,
    CharacterGenerateEnrichmentService,
  ],
  exports: [
    CharacterGenerateSuggestionsService,
    CharacterGenerateEnrichmentService,
  ],
})
export class CharacterGenerationModule {}
