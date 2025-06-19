import { Module } from '@nestjs/common';
import { PrismaModule } from '../services/prisma/prisma.module';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { OpenAIModule } from '../services/openai/openai.module';
import { CharacterController } from './character.controller';
import { CreateCharacterSuggestionService } from './services/create-character-suggestion.service';
import { CreateCharacterService } from './services/create-character.service';
import { FILE_STORAGE } from '../common/tokens';
import { SupabaseFileStorage } from '../test-utils/supabase-file-storage.service';
import { GetCharacterService } from './services/get-character.service';
import { ImageGenerationModule } from '../services/image-generation/image-generation.module';
import { CharacterGenerationModule } from '../services/character-generation/character-generation.module';
import { DeleteCharacterService } from './services/delete-character.service';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    OpenAIModule,
    CharacterGenerationModule,
    ImageGenerationModule,
  ],
  controllers: [CharacterController],
  providers: [
    GetCharacterService,
    DeleteCharacterService,
    CreateCharacterSuggestionService,
    CreateCharacterService,
    {
      provide: FILE_STORAGE,
      useClass: SupabaseFileStorage,
    },
  ],
})
export class CharacterModule {}
