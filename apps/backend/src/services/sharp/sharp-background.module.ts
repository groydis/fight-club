// src/common/services/sharp-background.module.ts
import { Module } from '@nestjs/common';
import { SharpBackgroundService } from './services/sharp-background.service';
import { SHARP_BACKGROUND } from '../../common/tokens';

@Module({
  providers: [
    {
      provide: SHARP_BACKGROUND,
      useClass: SharpBackgroundService,
    },
  ],
  exports: [SHARP_BACKGROUND],
})
export class SharpBackgroundModule {}
