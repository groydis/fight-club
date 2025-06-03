import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { OpenAiModule } from '../openai/openai.module';
import { CharacterController } from './character.controller';
import { CreateCharacterSuggestionService } from './services/create-character-suggestion.service';
import { CreateCharacterService } from './services/create-character.service';
import { FILE_STORAGE } from '../common/tokens';
import { MockFileStorage } from '../common/storage/mock-file-storage.service';
import { SupabaseFileStorage } from '../common/storage/supabase-file-storage.service';
import { GetCharacterService } from './services/get-character.service';

const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

@Module({
  imports: [PrismaModule, SupabaseModule, OpenAiModule],
  controllers: [CharacterController],
  providers: [
    GetCharacterService,
    CreateCharacterSuggestionService,
    CreateCharacterService,
    {
      provide: FILE_STORAGE,
      useClass: useMockServices ? MockFileStorage : SupabaseFileStorage,
    },
  ],
})
export class CharacterModule {}
