import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '../../auth/auth.guard';
import {
  AllowAllAuthGuard,
  DenyAllAuthGuard,
  local,
} from '../../test-utils/mock-auth.guard';
import { Reflector } from '@nestjs/core';
import { mockFileStorage } from '../../test-utils/mock-services';
import { UserModule } from '../user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SupabaseModule } from '../../services/supabase/supabase.module';
import { FILE_STORAGE } from '../../common/tokens';

describe('UserController (e2e)', () => {
  describe('Authenticated request', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          SupabaseModule,
          PrismaModule,
          UserModule,
        ],
        providers: [Reflector],
      })
        .overrideProvider(FILE_STORAGE)
        .useValue(mockFileStorage)
        .overrideGuard(AuthGuard)
        .useClass(AllowAllAuthGuard)
        .compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('GET /api/user returns authenticated user info', async () => {
      const res = await request(
        app.getHttpServer() as import('http').Server,
      ).get('/api/user');
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(local.id);
      // TODO: hard to test thorougly, but we should at least
      // check the shape of the body is correct
    });
  });

  describe('Unauthenticated request', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          SupabaseModule,
          PrismaModule,
          UserModule,
        ],
        providers: [Reflector],
      })
        .overrideProvider(FILE_STORAGE)
        .useValue(mockFileStorage)
        .overrideGuard(AuthGuard)
        .useClass(DenyAllAuthGuard)
        .compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('GET /api/user returns 401 if unauthenticated', async () => {
      const res = await request(
        app.getHttpServer() as import('http').Server,
      ).get('/api/user');
      expect(res.status).toBe(401);
      expect((res.body as { message: string }).message).toBe('Unauthorized');
    });
    it('GET /api/user returns 401 if unauthenticated', async () => {
      const res = await request(
        app.getHttpServer() as import('http').Server,
      ).patch(`/api/user/${local.id}`);
      expect(res.status).toBe(401);
      expect((res.body as { message: string }).message).toBe('Unauthorized');
    });
  });
});
