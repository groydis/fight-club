// src/character-image/character-image.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { LeonardoModule } from '../leonoardo/leonardo.module';
import { GenerateCharacterImage } from './services/generate-character-image.service';
import { CHARACTER_IMAGE_GENERATOR } from '../../common/tokens';
import { SharpBackgroundModule } from '../sharp/sharp-background.module';

@Module({
  imports: [HttpModule, PrismaModule, LeonardoModule, SharpBackgroundModule],
  providers: [
    {
      provide: CHARACTER_IMAGE_GENERATOR,
      useClass: GenerateCharacterImage,
    },
  ],
  exports: [CHARACTER_IMAGE_GENERATOR],
})
export class ImageGenerationModule {}
