// src/character-image/character-image.module.ts

import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { FILE_STORAGE } from '../../common/tokens';
import { SupabaseFileStorage } from '../../test-utils/supabase-file-storage.service';

@Module({
  imports: [SupabaseModule],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: SupabaseFileStorage,
    },
  ],
  exports: [FILE_STORAGE],
})
export class FileStorageModule {}
