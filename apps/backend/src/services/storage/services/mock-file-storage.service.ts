import { Injectable } from '@nestjs/common';
import { FileStorage } from '../interfaces/file-storage.interface';

@Injectable()
export class MockFileStorage implements FileStorage {
  // eslint-disable-next-line @typescript-eslint/require-await
  async upload(
    path: string,
    file: Buffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contentType: string, // TODO: Use contentType if needed
  ): Promise<string> {
    console.log(
      `[MockFileStorage] Pretending to upload ${path} (${file.length} bytes)`,
    );
    return `http://localhost:3000/mock/${path}`;
  }
}
