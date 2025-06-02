import { Injectable } from '@nestjs/common';
import { CharacterImageGenerator } from './character-image-generator.interface';

@Injectable()
export class MockCharacterImageGenerator implements CharacterImageGenerator {
  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(): Promise<{
    front: Buffer;
    back: Buffer;
    profile: Buffer;
  }> {
    const fakeImage = Buffer.from('fake image content');
    console.log('[MockImageGen] Returning fake image buffers');
    return {
      front: fakeImage,
      back: fakeImage,
      profile: fakeImage,
    };
  }
}
