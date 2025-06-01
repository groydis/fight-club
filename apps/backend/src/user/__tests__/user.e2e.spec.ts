import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { UserModule } from '../user.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { UserController } from '../user.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';

const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  created_at: '2025-01-01T00:00:00.000Z',
};

@Injectable()
class AllowAllAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    req.user = mockUser;
    return true;
  }
}

@Injectable()
class DenyAllAuthGuard {
  canActivate(): boolean {
    throw new UnauthorizedException('Unauthorized');
  }
}

describe('UserController (e2e)', () => {
  describe('Authenticated request', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot(), SupabaseModule, UserModule],
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

    it('GET /api/user returns authenticated user info', async () => {
      const res = await request(app.getHttpServer()).get('/api/user');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'User authenticated',
        user: mockUser,
      });
    });
  });

  describe('Unauthenticated request', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot(), SupabaseModule, UserModule],
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
      const res = await request(app.getHttpServer()).get('/api/user');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });
});
