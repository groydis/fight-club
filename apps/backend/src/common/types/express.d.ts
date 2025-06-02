// src/types/express.d.ts
import 'express';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserRole, UserStatus } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: {
      supabase: SupabaseUser;
      local: {
        id: string;
        name: string;
        role: UserRole;
        status: UserStatus;
      } | null;
    };
  }
}
