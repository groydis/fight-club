// src/leonardo/leonardo.service.ts

import { Injectable, HttpException, Logger } from '@nestjs/common';
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

interface GetGenerationStatusResponse {
  generations_by_pk: {
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
  private readonly logger = new Logger(LeonardoService.name);

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
      // Extract the raw response body if it exists
      const leoError = err.response?.data ?? err.message ?? err;
      this.logger.error(
        `Leonardo generation failed: ${JSON.stringify(leoError, null, 2)}`,
      );

      // Throw a 400 or 500 depending on what came back
      const status = err.response?.status ?? 500;
      throw new HttpException(
        `Leonardo generation error: ${JSON.stringify(leoError)}`,
        status,
      );
    }
  }

  async getGenerationStatus(
    generationId: string,
  ): Promise<GetGenerationStatusResponse> {
    try {
      const response$: Promise<AxiosResponse<GetGenerationStatusResponse>> =
        firstValueFrom(
          this.httpService.get<GetGenerationStatusResponse>(
            `/generations/${generationId}`,
          ),
        );

      const { data: body } = await response$;
      return body;
    } catch (err: any) {
      const leoError = err.response?.data ?? err.message ?? err;
      this.logger.error(
        `Leonardo status check failed: ${JSON.stringify(leoError, null, 2)}`,
      );
      throw new HttpException(
        `Leonardo status check error: ${JSON.stringify(leoError)}`,
        err.response?.status ?? 500,
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
      // 1) call getGenerationStatus and pull out generations_by_pk
      const fullStatus = await this.getGenerationStatus(generationId);
      const job = fullStatus.generations_by_pk;

      // 2) once status === 'COMPLETE', return all image URLs
      if (job.status === 'COMPLETE') {
        return job.generated_images.map((img) => img.url);
      }

      // 3) if 'FAILED', throw
      if (job.status === 'FAILED') {
        throw new HttpException('Image generation failed', 500);
      }

      // 4) if we've timed out, throw
      if (Date.now() - start > timeoutMs) {
        throw new HttpException('Image generation timed out', 408);
      }

      // 5) otherwise wait and retry
      await this.delay(intervalMs);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
