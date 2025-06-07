import { FileStorage } from '../services/storage/interfaces/file-storage.interface';

// test-utils/mock-services.ts
export const mockImageGenerator = {
  execute: jest.fn().mockResolvedValue({
    front: Buffer.from('mock front'),
    back: Buffer.from('mock back'),
    profile: Buffer.from('mock profile'),
  }),
};

export const mockFileStorage: FileStorage = {
  upload: jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
    async (uploadPath: string, fileBuffer: Buffer, contentType: string) => {
      // Always return this exact pattern so tests can assert on it:
      return `https://mock-storage.local/${uploadPath}`;
    },
  ),
};
