import { Background } from '../services/sharp/interfaces/background.interface';

// test-utils/mock-services/mock-sharp-background.service.ts
export class MockSharpBackgroundService implements Background {
  // eslint-disable-next-line @typescript-eslint/require-await
  async removeEdgeBackground(buffer: Buffer): Promise<Buffer> {
    // Just return the buffer untouched for test environments
    return buffer;
  }
}
