import { Module } from '@nestjs/common';
import { CharactersController } from './character.controller';
import { CharactersService } from './character.service';
import { OpenAiModule } from '../openai/openai.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule, OpenAiModule],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
