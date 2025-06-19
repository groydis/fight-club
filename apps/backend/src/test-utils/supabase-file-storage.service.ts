import { Injectable } from '@nestjs/common';
import { FileStorage } from '../services/storage/interfaces/file-storage.interface';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseFileStorage implements FileStorage {
  private readonly client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
  );

  private readonly bucket = 'characters';

  async upload(
    path: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${path}`;
  }
}
