import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../../openai/types/character.types';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from '../../openai/openai.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { UserModule } from '../../user/user.module';
import { CharactersModule } from '../characers.module';

describe('CharactersController (e2e)', () => {
  let app: INestApplication;

  const mockSuggestion: CharacterSuggestion = {
    stats: {
      strength: 6,
      agility: 4,
      intelligence: 3,
      charisma: 2,
      luck: 3,
      constitution: 2,
    },
    basicMoves: [
      { name: 'Soup Slap' },
      { name: 'Breadstick Jab' },
      { name: 'Crouton Kick' },
      { name: 'Boil Punch' },
      { name: 'Salt Fling' },
    ],
    specialMoves: [
      { name: 'Boil Over' },
      { name: 'Ladle of Justice' },
      { name: 'Steam Surge' },
      { name: 'Molten Splash' },
      { name: 'Final Simmer' },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        OpenAiModule,
        SupabaseModule,
        UserModule,
        CharactersModule,
      ],
    })
      .overrideProvider(GenerateCharacterSuggestionsService)
      .useValue({ execute: jest.fn().mockResolvedValue(mockSuggestion) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /api/characters/suggestion returns a valid suggestion payload', async () => {
    const server = app.getHttpServer() as import('http').Server;
    const response = await request(server)
      .post('/api/characters/suggestion')
      .send({
        name: 'Groovy Gravy',
        description: 'The sauciest soup-slinger in the outer rim.',
      })
      .expect(201);

    const responseBody = response.body as CharacterSuggestion;

    expect(responseBody.stats).toBeDefined();
    expect(responseBody.basicMoves.length).toBe(5);
    expect(responseBody.specialMoves.length).toBe(5);
    expect(responseBody.stats.strength).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
