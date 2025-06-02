import { Module } from '@nestjs/common';
import { CharactersController } from './character.controller';
import { CharactersService } from './character.service';
import { OpenAiModule } from '../openai/openai.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaModule } from '../prisma/prisma.module';

// import { CharacterImageGenerator } from '../common/image-generation/character-image-generator.interface';
import { MockCharacterImageGenerator } from '../common/image-generation/mock-character-image-generator.service';

// import { FileStorage } from '../common/storage/file-storage.interface';
import { MockFileStorage } from '../common/storage/mock-file-storage.service';

import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../common/tokens';

const useMockImageGen = process.env.MOCK_IMAGE_GEN === 'true';
const useMockFileStorage = process.env.MOCK_FILE_STORAGE === 'true';

@Module({
  imports: [PrismaModule, SupabaseModule, OpenAiModule],
  controllers: [CharactersController],
  providers: [
    CharactersService,
    {
      provide: CHARACTER_IMAGE_GENERATOR,
      useClass: useMockImageGen
        ? MockCharacterImageGenerator
        : MockCharacterImageGenerator, // Replace later
    },
    {
      provide: FILE_STORAGE,
      useClass: useMockFileStorage ? MockFileStorage : MockFileStorage, // Replace later
    },
  ],
})
export class CharactersModule {}
