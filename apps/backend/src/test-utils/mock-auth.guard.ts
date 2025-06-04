import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { STATIC_USERS } from './static.users';
import { UserRole, UserStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/types/extended-request';

export const mockSupabaseUser = {
  id: STATIC_USERS.activeUser1,
  aud: 'authenticated',
  email: 'test@example.com',
  created_at: '2025-01-01T00:00:00.000Z',
  confirmed_at: '2025-01-01T00:00:00.000Z',
  last_sign_in_at: '2025-01-01T00:00:00.000Z',
  role: 'authenticated',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    email_verified: true,
  },
  identities: [],
  phone: '',
};

export const local = {
  id: STATIC_USERS.activeUser1,
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
};

@Injectable()
export class AllowAllAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    req.user = req.user ?? {
      supabase: mockSupabaseUser,
      local,
    }; // fallback
    return true;
  }
}

@Injectable()
export class DenyAllAuthGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    throw new UnauthorizedException('Unauthorized');
  }
}
