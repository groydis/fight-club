// src/character-image/character-image.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { LeonardoModule } from '../leonoardo/leonardo.module';
import { CharacterGenerateEnrichmentService } from './services/character-generate-enrichment.service';
import { CharacterGenerateSuggestionsService } from './services/character-generate-suggestions.service';
@Module({
  imports: [HttpModule, PrismaModule, LeonardoModule],
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
