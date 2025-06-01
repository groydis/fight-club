import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAIApi from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

type Message = {
  text: string;
  ai?: boolean;
};

@Injectable()
export class ChatGptService {
  public openai: OpenAIApi;

  constructor() {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
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

  async generateImage(text: string): Promise<string> {
    try {
      // Make a request to the DALL-E model for image generation
      const { data } = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: text,
        response_format: 'url',
      });

      if (!data || !data.length || !data[0]?.url) {
        throw new ServiceUnavailableException(
          'No image URL returned from OpenAI',
        );
      }

      return data[0].url;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException('Failed to generate image');
    }
  }
}
