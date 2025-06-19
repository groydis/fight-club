// src/common/services/sharp-background.module.ts
import { Module } from '@nestjs/common';
import { SharpBackgroundService } from './services/sharp-background.service';
import { MockSharpBackgroundService } from './services/mock-shark-background.service';
import { SHARP_BACKGROUND } from '../../common/tokens';

const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

@Module({
  providers: [
    {
      provide: SHARP_BACKGROUND,
      useClass: useMockServices
        ? MockSharpBackgroundService
        : SharpBackgroundService,
    },
  ],
  exports: [SHARP_BACKGROUND],
})
export class SharpBackgroundModule {}
