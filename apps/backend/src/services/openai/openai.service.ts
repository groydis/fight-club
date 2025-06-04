import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAIApi from 'openai';
import {
  ChatCompletion,
  ChatCompletionMessageParam,
  ModerationCreateResponse,
} from 'openai/resources';

type Message = {
  text: string;
  ai?: boolean;
};

@Injectable()
export class OpenAIService {
  public openai: OpenAIApi;

  constructor() {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async checkModeration(
    text: string,
  ): Promise<{ flagged: boolean; categories: Record<string, boolean> }> {
    try {
      const result: ModerationCreateResponse =
        await this.openai.moderations.create({ input: text });
      const [moderation] = result.results;
      return {
        flagged: moderation.flagged,
        categories: moderation.categories as unknown as Record<string, boolean>,
      };
    } catch (e) {
      console.error('Moderation check failed:', e);
      throw new ServiceUnavailableException('Moderation check failed');
    }
  }

  async chatGptRequest<T>(prompt: string, messages: Message[]): Promise<T> {
    try {
      // Convert message history to the format expected by the OpenAI API
      const history = messages.map(
        (message): ChatCompletionMessageParam => ({
          role: message.ai ? 'assistant' : 'user',
          content: message.text,
        }),
      );

      // Make a request to the ChatGPT model
      const completion: ChatCompletion =
        await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            ...history,
          ],
          temperature: 0.5,
          max_tokens: 1000,
        });

      // Extract the content from the response
      const [content] = completion.choices.map(
        (choice) => choice.message.content ?? '',
      );

      if (
        !completion.choices.length ||
        !completion.choices[0].message?.content
      ) {
        throw new ServiceUnavailableException(
          'No content returned from OpenAI',
        );
      }

      return JSON.parse(content) as T;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException('Failed request to ChatGPT');
    }
  }

  async generateImageBase64(text: string): Promise<Buffer> {
    try {
      const { data } = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: text,
        response_format: 'b64_json',
        size: '1024x1024',
        n: 1,
      });

      if (!data || !data.length || !data[0]?.b64_json) {
        throw new ServiceUnavailableException(
          'No image data returned from OpenAI',
        );
      }

      return Buffer.from(data[0].b64_json, 'base64');
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Failed to generate image');
    }
  }
}
