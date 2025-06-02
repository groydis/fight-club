import { Module } from '@nestjs/common';
import { CharactersController } from './character.controller';
import { CharactersService } from './character.service';
import { OpenAiModule } from '../openai/openai.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FILE_STORAGE } from '../common/tokens';
import { MockFileStorage } from '../common/storage/mock-file-storage.service';
import { SupabaseFileStorage } from '../common/storage/supabase-file-storage.service';

const useMockServices = process.env.MOCK_FILE_STORAGE === 'true';

@Module({
  imports: [PrismaModule, SupabaseModule, OpenAiModule],
  controllers: [CharactersController],
  providers: [
    CharactersService,
    {
      provide: FILE_STORAGE,
      useClass: useMockServices ? MockFileStorage : SupabaseFileStorage, // Replace later
    },
  ],
})
export class CharactersModule {}
