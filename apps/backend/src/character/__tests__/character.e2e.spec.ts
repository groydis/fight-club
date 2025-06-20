import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CharacterSuggestion } from '../../common/types/character.types';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from '../../services/openai/openai.module';
import { SupabaseModule } from '../../services/supabase/supabase.module';
import { UserModule } from '../../user/user.module';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CharacterGenerateSuggestionsService } from '../../services/character-generation/services/character-generate-suggestions.service';
import { CharacterGenerateEnrichmentService } from '../../services/character-generation/services/character-generate-enrichment.service';
import { MockGenerateImage } from '../../test-utils/mock-generate-image.service';
import { MockFileStorage } from '../../services/storage/services/mock-file-storage.service';
import { CHARACTER_IMAGE_GENERATOR, FILE_STORAGE } from '../../common/tokens';
import {
  AllowAllAuthGuard,
  DenyAllAuthGuard,
} from '../../test-utils/mock-auth.guard';
import {
  mockFileStorage,
  mockImageGenerator,
} from '../../test-utils/mock-services';
import {
  mockEnriched,
  mockSuggestion,
} from '../../test-utils/mock-character.data';
import { AuthGuard } from '../../auth/auth.guard';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CharacterModule } from '../character.module';

describe('Character (e2e)', () => {
  describe('Authenticated requests', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          SupabaseModule,
          PrismaModule,
          OpenAIModule,
          CharacterModule,
        ],
        providers: [Reflector],
      })
        .overrideProvider(CHARACTER_IMAGE_GENERATOR)
        .useValue(mockImageGenerator)
        .overrideProvider(FILE_STORAGE)
        .useValue(mockFileStorage)
        .overrideProvider(CharacterGenerateSuggestionsService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockSuggestion) })
        .overrideProvider(CharacterGenerateEnrichmentService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockEnriched) })
        .overrideGuard(AuthGuard)
        .useClass(AllowAllAuthGuard)
        .compile();

      app = moduleFixture.createNestApplication();

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('POST /api/character/suggestion', () => {
      it('POST /api/character/suggestion returns a valid enriched suggestion payload', async () => {
        const res = await request(app.getHttpServer() as import('http').Server)
          .post('/api/character/suggestion')
          .send({
            name: 'Groovy Gravy',
            description: 'The sauciest soup-slinger in the outer rim.',
            gender: 'Male',
            species: 'Human',
            alignment: 'TrueNeutral',
          })
          .expect(201);

        const body = res.body as CharacterSuggestion;
        expect(body.stats).toBeDefined();
        expect(Object.values(body.stats).reduce((a, b) => a + b)).toBe(30);

        expect(body.basicMoves).toHaveLength(6);
        body.basicMoves.forEach((m) => expect(m.name).toBeDefined());

        expect(body.specialMoves).toHaveLength(6);
        body.specialMoves.forEach((m) => expect(m.name).toBeDefined());
      });

      it('should return 400 if name is missing', async () => {
        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character/suggestion')
          .send({ description: 'Missing name' })
          .expect(400);
      });

      it('should return 400 if description is missing', async () => {
        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character/suggestion')
          .send({ name: 'MissingDesc' })
          .expect(400);
      });

      it('should return 400 if fields are empty strings', async () => {
        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character/suggestion')
          .send({ name: '', description: '' })
          .expect(400);
      });
    });

    describe('POST /api/character', () => {
      it('POST /api/character creates a new character and returns DTO', async () => {
        const payload = {
          name: 'Groovy Gravy',
          description: 'The sauciest soup-slinger in the outer rim.',
          gender: 'Male',
          species: 'Human',
          alignment: 'TrueNeutral',
          stats: mockSuggestion.stats,
          basicMoves: mockSuggestion.basicMoves.slice(0, 2).map((move) => ({
            name: move.name,
            primaryStat: move.primaryStat as
              | 'strength'
              | 'agility'
              | 'intelligence'
              | 'charisma'
              | 'luck'
              | 'constitution',
          })),
          specialMoves: mockSuggestion.specialMoves.slice(0, 2).map((move) => ({
            name: move.name,
            primaryStat: move.primaryStat as
              | 'strength'
              | 'agility'
              | 'intelligence'
              | 'charisma'
              | 'luck'
              | 'constitution',
          })),
        };

        const res = await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(payload)
          .expect(201);

        await new Promise((resolve) => setTimeout(resolve, 10));

        const body = res.body;
        expect(body.id).toBeDefined();
        expect(body.name).toBe(payload.name);
        expect(body.description).toBe(payload.description);
        expect(body.lore).toBe(mockEnriched.lore);
        expect(body.stats).toEqual(payload.stats);
        expect(body.moves).toHaveLength(4);

        expect(mockImageGenerator.execute).toHaveBeenCalledWith({
          characterId: body.id,
          visualDescription: mockEnriched.visualDescription,
          imageGenerationHints: mockEnriched.imageGenerationHints,
        });

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockFileStorage.upload).toHaveBeenCalledTimes(2);
      });

      it('should return 400 if name is missing', async () => {
        const invalidPayload = {
          description: 'Missing name',
          stats: mockSuggestion.stats,
          basicMoves: mockSuggestion.basicMoves.slice(0, 2),
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(invalidPayload)
          .expect(400);
      });

      it('should return 400 if stats are missing', async () => {
        const invalidPayload = {
          name: 'No Stats',
          description: 'Oops',
          basicMoves: mockSuggestion.basicMoves.slice(0, 2),
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(invalidPayload)
          .expect(400);
      });

      it('should return 400 if a stat value is out of range', async () => {
        const invalidStats = { ...mockSuggestion.stats, strength: 15 }; // Max is 10
        const invalidPayload = {
          name: 'Stat Breaker',
          description: 'Too strong',
          stats: invalidStats,
          basicMoves: mockSuggestion.basicMoves.slice(0, 2),
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(invalidPayload)
          .expect(400);
      });

      it('should return 400 if basicMoves is not an array', async () => {
        const invalidPayload = {
          name: 'Invalid Moves',
          description: 'Bad format',
          stats: mockSuggestion.stats,
          basicMoves: 'Soup Slap', // should be an array
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(invalidPayload)
          .expect(400);
      });

      it('should return 400 if move has an invalid primaryStat', async () => {
        const invalidPayload = {
          name: 'Bad Stat',
          description: 'Wrong primaryStat',
          stats: mockSuggestion.stats,
          basicMoves: [{ name: 'Oops', primaryStat: 'power' }],
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer() as import('http').Server)
          .post('/api/character')
          .send(invalidPayload)
          .expect(400);
      });
    });
  });

  describe('Unauthenticated request', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          OpenAIModule,
          SupabaseModule,
          UserModule,
          CharacterModule,
        ],
        providers: [
          Reflector,
          {
            provide: CHARACTER_IMAGE_GENERATOR,
            useClass: MockGenerateImage,
          },
          {
            provide: FILE_STORAGE,
            useClass: MockFileStorage,
          },
        ],
      })
        .overrideProvider(CHARACTER_IMAGE_GENERATOR)
        .useValue(mockImageGenerator)
        .overrideProvider(FILE_STORAGE)
        .useValue(mockFileStorage)
        .overrideProvider(CharacterGenerateSuggestionsService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockSuggestion) })
        .overrideProvider(CharacterGenerateEnrichmentService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockEnriched) })
        .overrideGuard(AuthGuard)
        .useClass(DenyAllAuthGuard)
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should return 401 if unauthenticated', async () => {
      await request(app.getHttpServer() as import('http').Server)
        .post('/api/character/suggestion')
        .send({ name: 'Blocked User', description: 'Should not get in' })
        .expect(401);
    });

    it('should return 401 if unauthenticated', async () => {
      await request(app.getHttpServer() as import('http').Server)
        .post('/api/character')
        .send({ name: 'Blocked User', description: 'Should not get in' })
        .expect(401);
    });
  });
});
