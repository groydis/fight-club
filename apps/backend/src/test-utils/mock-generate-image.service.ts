import { Injectable } from '@nestjs/common';
import { CharacterImageGenerator } from '../services/image-generation/interface/character-image-generator.interface';

@Injectable()
export class MockGenerateImage implements CharacterImageGenerator {
  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(): Promise<{
    front: Buffer;
    profile: Buffer;
  }> {
    const fakeImage = Buffer.from('fake image content');
    console.log('[MockImageGen] Returning fake image buffers');
    return {
      front: fakeImage,
      profile: fakeImage,
    };
  }
}
