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
} from '../../test-utils/mock-auth.guard';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { Reflector } from '@nestjs/core';
import { UpdateUserService } from '../services/update-user.service';

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
        providers: [Reflector, UpdateUserService],
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
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(local.id);
      expect(res.body.user.name).toBe(local.name);
      expect(res.body.user.email).toBe(local.email);
      expect(res.body.user.role).toBe(local.role);
      expect(res.body.user.status).toBe(local.status);
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
        providers: [UpdateUserService],
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
    it('GET /api/user returns 401 if unauthenticated', async () => {
      const res = await request(
        app.getHttpServer() as import('http').Server,
      ).patch(`/api/user/${local.id}`);
      expect(res.status).toBe(401);
      expect((res.body as { message: string }).message).toBe('Unauthorized');
    });
  });
});
