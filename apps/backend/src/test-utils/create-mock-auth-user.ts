// test-utils/create-mock-auth-user.ts
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { UserRole, UserStatus } from '@prisma/client';
import {
  AuthenticatedRequest,
  LocalUser,
  SupabaseUser,
} from '../common/types/extended-request';

export interface MockAuthUser {
  id: string;
  email: string;
  local: LocalUser;
  supabase: SupabaseUser;
  requestUser: AuthenticatedRequest['user'];
}

export async function createMockAuthUser(
  prisma: PrismaService,
): Promise<MockAuthUser> {
  const id = faker.string.uuid();
  const email = faker.internet.email();

  const local = await prisma.user.create({
    data: {
      id,
      name: 'Test User',
      email,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  const supabase = {
    id,
    aud: 'authenticated',
    email,
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { email_verified: true },
    identities: [],
    phone: '',
  };

  const requestUser: AuthenticatedRequest['user'] = { local, supabase };

  return { id, email, local, supabase, requestUser };
}
