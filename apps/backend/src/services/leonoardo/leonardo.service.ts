// src/leonardo/leonardo.service.ts

import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface GenerationRequest {
  prompt: string;
  modelId: string;
  width: number;
  height: number;
  num_images: number;
  negative_prompt?: string;
  guidance_scale?: number;
}

interface GenerationResponse {
  sdGenerationJob: {
    generationId: string;
  };
}

interface GenerationStatusResponse {
  sdGenerationJob: {
    generationId: string;
    status: 'PENDING' | 'COMPLETE' | 'FAILED';
    generated_images: {
      url: string;
      id: string;
      nsfw: boolean;
    }[];
  };
}

@Injectable()
export class LeonardoService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(data: GenerationRequest): Promise<string> {
    try {
      const response$: Promise<AxiosResponse<GenerationResponse>> =
        firstValueFrom(
          this.httpService.post<GenerationResponse>('/generations', {
            prompt: data.prompt,
            modelId: data.modelId,
            width: data.width,
            height: data.height,
            num_images: data.num_images,
            negative_prompt: data.negative_prompt,
            guidance_scale: data.guidance_scale,
          }),
        );

      const { data: body } = await response$;
      return body.sdGenerationJob.generationId;
    } catch (err: any) {
      // Now `err` is `any`, so you can inspect `.response` and `.message`
      throw new HttpException(
        `Leonardo generation error: ${err.response?.data || err.message}`,
        err.response?.status || 500,
      );
    }
  }

  async getGenerationStatus(
    generationId: string,
  ): Promise<GenerationStatusResponse> {
    try {
      const response$: Promise<AxiosResponse<GenerationStatusResponse>> =
        firstValueFrom(
          this.httpService.get<GenerationStatusResponse>(
            `/generations/${generationId}`,
          ),
        );

      const { data: body } = await response$;
      return body;
    } catch (err: any) {
      throw new HttpException(
        `Leonardo status check error: ${err.response?.data || err.message}`,
        err.response?.status || 500,
      );
    }
  }

  async waitForCompletion(
    generationId: string,
    intervalMs = 3000,
    timeoutMs = 120000,
  ): Promise<string[]> {
    const start = Date.now();
    while (true) {
      const { sdGenerationJob } = await this.getGenerationStatus(generationId);

      if (sdGenerationJob.status === 'COMPLETE') {
        return sdGenerationJob.generated_images.map((img) => img.url);
      }

      if (sdGenerationJob.status === 'FAILED') {
        throw new HttpException('Image generation failed', 500);
      }

      if (Date.now() - start > timeoutMs) {
        throw new HttpException('Image generation timed out', 408);
      }

      await this.delay(intervalMs);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
