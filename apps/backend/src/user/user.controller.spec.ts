import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common';
import request from 'supertest';
import { UserController } from './user.controller';
import { AuthGuard } from '../common/guards/auth.guard';

describe('UserController (integration)', () => {
  let app: INestApplication;

  const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
    created_at: '2025-01-01T00:00:00.000Z',
  };

  const mockAuthGuard: CanActivate = {
    canActivate(context: ExecutionContext): boolean {
      const req = context
        .switchToHttp()
        .getRequest<{ user?: typeof mockUser }>();
      req.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
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
    expect(res.body).toEqual({
      message: 'User authenticated',
      user: mockUser,
    });
  });
});
