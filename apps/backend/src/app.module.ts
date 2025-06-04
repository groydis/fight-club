// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './services/supabase/supabase.module';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characters.module';
import { OpenAIModule } from './services/openai/openai.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { CharacterModule } from './character/character.module';
import { LeonardoModule } from './services/leonoardo/leonardo.module';
import { CharacterGenerateEnrichmentService } from './services/character-generation/services/character-generate-enrichment.service';
import { CharacterGenerateSuggestionsService } from './services/character-generation/services/character-generate-suggestions.service';
import { GenerateCharacterImage } from './services/image-generation/services/generate-character-image.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    OpenAIModule,
    LeonardoModule,
    CharacterGenerateEnrichmentService,
    CharacterGenerateSuggestionsService,
    GenerateCharacterImage,
    SupabaseModule,
    UserModule,
    CharacterModule,
    CharactersModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
