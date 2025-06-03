// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './services/supabase/supabase.module';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characters.module';
import { OpenAiModule } from './services/openai/openai.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { CharacterModule } from './character/character.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    OpenAiModule,
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
