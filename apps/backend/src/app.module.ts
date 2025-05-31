// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characers.module';
import { OpenAiModule } from './openai/openai.module';
import { MiddlewareModule } from './middleware/middleware.module'; // ✅ Add this

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
  providers: [AppService],
})
export class AppModule {}
