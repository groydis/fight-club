import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

function createMockContext(authHeader?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: authHeader ? { authorization: authHeader } : {},
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: () => [],
    getArgByIndex: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    switchToRpc: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    switchToWs: () => ({}) as any,
    getType: () => 'http',
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let prisma: PrismaService;
  let supabaseService: SupabaseService;
  let reflector: Reflector;

  let testUserId: string;
  let testUserEmail: string;

  beforeEach(() => {
    prisma = new PrismaService();

    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    // Create a fresh user each time
    testUserId = faker.string.uuid();
    testUserEmail = faker.internet.exampleEmail();

    supabaseService = {
      getClient: () => ({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: {
              user: {
                id: testUserId,
                email: testUserEmail,
                email_confirmed_at: '2025-01-01T00:00:00.000Z',
                confirmed_at: null,
                user_metadata: { email_verified: true },
              },
            },
            error: null,
          }),
        },
      }),
    } as any;

    guard = new AuthGuard(supabaseService, reflector, prisma);
  });

  afterEach(async () => {
    await prisma.character.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
  });

  it('should throw if no Authorization header', async () => {
    const context = createMockContext();
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if Authorization header is invalid', async () => {
    const context = createMockContext('InvalidToken');
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should create new user if not found and allow access', async () => {
    const context = createMockContext('Bearer sometoken');
    await expect(guard.canActivate(context)).resolves.toBe(true);

    const created = await prisma.user.findUnique({
      where: { id: testUserId },
    });

    expect(created).not.toBeNull();
    expect(created?.status).toBe(UserStatus.ACTIVE);
    expect(created?.email).toBe(testUserEmail);
  });

  it('should reject if user is banned', async () => {
    await prisma.user.create({
      data: {
        id: testUserId,
        name: 'authyBoy',
        email: testUserEmail,
        role: UserRole.USER,
        status: UserStatus.BANNED,
      },
    });

    const context = createMockContext('Bearer sometoken');
    await expect(guard.canActivate(context)).rejects.toThrow('User is banned');
  });

  it('should pass if user exists and is active', async () => {
    await prisma.user.create({
      data: {
        id: testUserId,
        name: 'authyBoy',
        email: testUserEmail,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    const context = createMockContext('Bearer sometoken');
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw if Supabase user has no email', async () => {
    supabaseService = {
      getClient: () => ({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: {
              user: {
                id: testUserId,
                email: null,
                email_confirmed_at: null,
                confirmed_at: null,
                user_metadata: {},
              },
            },
            error: null,
          }),
        },
      }),
    } as any;

    guard = new AuthGuard(supabaseService, reflector, prisma);
    const context = createMockContext('Bearer sometoken');
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Invalid or expired token',
    );
  });
});
