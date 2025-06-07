// src/character-image/character-image.module.ts

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { FILE_STORAGE } from '../../common/tokens';
import { MockFileStorage } from './services/mock-file-storage.service';
import { SupabaseFileStorage } from './services/supabase-file-storage.service';

const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

@Module({
  imports: [SupabaseModule],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: useMockServices ? MockFileStorage : SupabaseFileStorage,
    },
  ],
  exports: [FILE_STORAGE],
})
export class FileStorageModule {}
