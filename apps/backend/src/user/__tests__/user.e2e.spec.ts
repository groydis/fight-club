import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { UserModule } from '../user.module';
import { SupabaseModule } from '../../services/supabase/supabase.module';
import { UserController } from '../user.controller';
import { AuthGuard } from '../../auth/auth.guard';
import {
  AllowAllAuthGuard,
  DenyAllAuthGuard,
  local,
  mockSupabaseUser,
} from '../../test-utils/mock-auth.guard';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { Reflector } from '@nestjs/core';

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
        controllers: [UserController],
        providers: [Reflector],
      })
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
      expect(res.body.message).toBe('User authenticated');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.supabase.id).toBe(mockSupabaseUser.id);
      expect(res.body.user.local.id).toBe(local.id);
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
        controllers: [UserController],
      })
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
  });
});
