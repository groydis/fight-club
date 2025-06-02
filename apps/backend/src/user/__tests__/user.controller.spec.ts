import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from '../user.controller';
import { AuthGuard } from '../../auth/auth.guard';
import {
  AllowAllAuthGuard,
  local,
  mockSupabaseUser,
} from '../../test-utils/mock-auth.guard';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseModule } from '../../supabase/supabase.module';

describe('UserController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, PrismaModule],
      controllers: [UserController],
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

  it('GET /api/user should return the user info if authenticated', async () => {
    const server = app.getHttpServer() as import('http').Server;
    const res = await request(server).get('/api/user');
    expect(res.status).toBe(200);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User authenticated');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.supabase.id).toBe(mockSupabaseUser.id);
    expect(res.body.user.local.id).toBe(local.id);
  });
});
