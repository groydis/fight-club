// src/types/extended-request.ts
import { Request } from 'express';
import { UserRole, UserStatus } from '@prisma/client';

export interface SupabaseUser {
  id: string;
  aud: string;
  email: string;
  created_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  role: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email_verified: boolean;
  };
  identities: any[];
  phone: string;
}

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user: {
    supabase: SupabaseUser;
    local: LocalUser;
  };
}
