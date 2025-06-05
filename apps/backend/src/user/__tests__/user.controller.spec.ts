import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from '../user.controller';
import { AuthGuard } from '../../auth/auth.guard';
import { AllowAllAuthGuard, local } from '../../test-utils/mock-auth.guard';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SupabaseModule } from '../../services/supabase/supabase.module';

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
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBe(local.id);
    expect(res.body.user.name).toBe(local.name);
    expect(res.body.user.email).toBe(local.email);
    expect(res.body.user.role).toBe(local.role);
    expect(res.body.user.status).toBe(local.status);
  });
});
