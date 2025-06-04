// src/leonardo/leonardo.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LeonardoService } from './leonardo.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('LEONARDO_API_BASE'),
        headers: {
          Authorization: `Bearer ${config.get<string>('LEONARDO_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LeonardoService],
  exports: [LeonardoService],
})
export class LeonardoModule {}
