// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characters.module';
import { OpenAiModule } from './openai/openai.module';
import { MiddlewareModule } from './middleware/middleware.module'; // ✅ Add this
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenAiModule,
    SupabaseModule,
    UserModule,
    CharactersModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
