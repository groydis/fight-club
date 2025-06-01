import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { GenerateCharacterSuggestionsService } from '../../openai/queries/generate-character-suggestions.service';
import { CharacterSuggestion } from '../../openai/types/character.types';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from '../../openai/openai.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { UserModule } from '../../user/user.module';
import { CharactersModule } from '../characters.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { APP_GUARD } from '@nestjs/core';
import { GenerateEnrichCharacterService } from '../../openai/queries/generate-character-enrichment.service';

@Injectable()
class DenyAllGuard {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    console.log('✅ Guard triggered: DENY');
    throw new UnauthorizedException('You shall not pass');
  }
}

@Injectable()
class AllowAllGuard {
  canActivate(context: ExecutionContext): boolean {
    console.log('✅ Guard triggered: ALLOW');
    const req = context.switchToHttp().getRequest<Request>();
    req.user = { id: 'test-user' };

    return true;
  }
}

describe('CharactersController (e2e)', () => {
  const mockSuggestion: CharacterSuggestion = {
    stats: {
      strength: 6,
      agility: 4,
      intelligence: 3,
      charisma: 4,
      luck: 6,
      constitution: 7,
    },
    basicMoves: [
      { name: 'Soup Slap', primaryStat: 'strength' },
      { name: 'Breadstick Jab', primaryStat: 'agility' },
      { name: 'Crouton Kick', primaryStat: 'strength' },
      { name: 'Boil Punch', primaryStat: 'constitution' },
      { name: 'Salt Fling', primaryStat: 'luck' },
      { name: 'Salt Toss', primaryStat: 'agility' },
    ],
    specialMoves: [
      { name: 'Boil Over', primaryStat: 'constitution' },
      { name: 'Ladle of Justice', primaryStat: 'strength' },
      { name: 'Steam Surge', primaryStat: 'intelligence' },
      { name: 'Molten Splash', primaryStat: 'strength' },
      { name: 'Final Simmer', primaryStat: 'luck' },
      { name: 'Salty Smile', primaryStat: 'charisma' },
    ],
  };

  const mockEnriched = {
    lore: 'Forged in the depths of a forgotten soup kitchen.',
    basicMoves: [
      {
        name: 'Spoon Slam',
        description: 'Hits hard with broth-laced power.',
        effectValue: 20,
      },
      {
        name: 'Slippery Swipe',
        description: 'Slips through defense like oil.',
        effectValue: 15,
      },
    ],
    specialMoves: [
      {
        name: 'Boil Over',
        description: 'Unleashes molten gravy.',
        effectValue: 40,
      },
      {
        name: 'Gravy Geyser',
        description: 'Erupts in seasoned fury.',
        effectValue: 35,
      },
    ],
  };

  describe('Authenticated requests', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          OpenAiModule,
          SupabaseModule,
          UserModule,
          CharactersModule,
        ],
        providers: [
          {
            provide: APP_GUARD,
            useClass: AllowAllGuard,
          },
        ],
      })
        .overrideProvider(GenerateCharacterSuggestionsService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockSuggestion) })
        .overrideProvider(GenerateEnrichCharacterService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockEnriched) })
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

    describe('POST /api/characters/suggestion', () => {
      it('POST /api/characters/suggestion returns a valid enriched suggestion payload', async () => {
        const res = await request(app.getHttpServer() as import('http').Server)
          .post('/api/characters/suggestion')
          .send({
            name: 'Groovy Gravy',
            description: 'The sauciest soup-slinger in the outer rim.',
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
          .post('/api/characters/suggestion')
          .send({ description: 'Missing name' })
          .expect(400);
      });

      it('should return 400 if description is missing', async () => {
        await request(app.getHttpServer() as import('http').Server)
          .post('/api/characters/suggestion')
          .send({ name: 'MissingDesc' })
          .expect(400);
      });

      it('should return 400 if fields are empty strings', async () => {
        await request(app.getHttpServer() as import('http').Server)
          .post('/api/characters/suggestion')
          .send({ name: '', description: '' })
          .expect(400);
      });
    });

    describe('POST /api/characters', () => {
      it('POST /api/characters creates a new character and returns DTO', async () => {
        const payload = {
          name: 'Groovy Gravy',
          description: 'The sauciest soup-slinger in the outer rim.',
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

        const res = await request(app.getHttpServer())
          .post('/api/characters')
          .send(payload)
          .expect(201);

        const body = res.body;
        expect(body.id).toBeDefined();
        expect(body.name).toBe(payload.name);
        expect(body.description).toBe(payload.description);
        expect(body.lore).toBe(mockEnriched.lore);
        expect(body.stats).toEqual(payload.stats);
        expect(body.moves).toHaveLength(4);
      });
      it('should return 400 if name is missing', async () => {
        const invalidPayload = {
          description: 'Missing name',
          stats: mockSuggestion.stats,
          basicMoves: mockSuggestion.basicMoves.slice(0, 2),
          specialMoves: mockSuggestion.specialMoves.slice(0, 2),
        };

        await request(app.getHttpServer())
          .post('/api/characters')
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

        await request(app.getHttpServer())
          .post('/api/characters')
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

        await request(app.getHttpServer())
          .post('/api/characters')
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

        await request(app.getHttpServer())
          .post('/api/characters')
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

        await request(app.getHttpServer())
          .post('/api/characters')
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
          OpenAiModule,
          SupabaseModule,
          UserModule,
          CharactersModule,
        ],
        providers: [
          {
            provide: APP_GUARD,
            useClass: DenyAllGuard,
          },
        ],
      })
        .overrideProvider(GenerateCharacterSuggestionsService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockSuggestion) })
        .overrideProvider(GenerateEnrichCharacterService)
        .useValue({ execute: jest.fn().mockResolvedValue(mockEnriched) })
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
        .post('/api/characters/suggestion')
        .send({ name: 'Blocked User', description: 'Should not get in' })
        .expect(401);
    });

    it('should return 401 if unauthenticated', async () => {
      await request(app.getHttpServer() as import('http').Server)
        .post('/api/characters')
        .send({ name: 'Blocked User', description: 'Should not get in' })
        .expect(401);
    });
  });
});
