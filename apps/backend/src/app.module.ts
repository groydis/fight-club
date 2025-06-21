// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SupabaseModule } from './services/supabase/supabase.module';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characters.module';
import { OpenAIModule } from './services/openai/openai.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { CharacterModule } from './character/character.module';
import { LeonardoModule } from './services/leonoardo/leonardo.module';
import { CharacterGenerationModule } from './services/character-generation/character-generation.module';
import { ImageGenerationModule } from './services/image-generation/image-generation.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    OpenAIModule,
    LeonardoModule,
    SupabaseModule,
    CharacterGenerationModule,
    ImageGenerationModule,
    UserModule,
    CharacterModule,
    CharactersModule,
    ReportModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
