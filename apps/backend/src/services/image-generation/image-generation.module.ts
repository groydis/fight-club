// src/character-image/character-image.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { LeonardoModule } from '../leonoardo/leonardo.module';
import { GenerateCharacterImage } from './services/generate-character-image.service';
import { CHARACTER_IMAGE_GENERATOR } from '../../common/tokens';
import { MockGenerateImage } from './services/mock-generate-image.service';
import { SharpBackgroundModule } from '../sharp/sharp-background.module';

const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

@Module({
  imports: [HttpModule, PrismaModule, LeonardoModule, SharpBackgroundModule],
  providers: [
    {
      provide: CHARACTER_IMAGE_GENERATOR,
      useClass: useMockServices ? MockGenerateImage : GenerateCharacterImage,
    },
  ],
  exports: [CHARACTER_IMAGE_GENERATOR],
})
export class ImageGenerationModule {}
